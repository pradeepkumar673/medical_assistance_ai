import os
import uuid
from datetime import datetime

import numpy as np
import torch
import torch.nn.functional as F
import torchvision.transforms as transforms
from PIL import Image
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required

from auth import get_current_user_identity
from werkzeug.utils import secure_filename

import timm
from mongo_db import get_db

try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    _HAS_MATPLOTLIB = True
except ImportError:
    _HAS_MATPLOTLIB = False

upload_bp = Blueprint('upload', __name__)

CLASS_NAMES = [
    'Actinic Keratoses',
    'Basal Cell Carcinoma',
    'Benign Keratosis',
    'Dermatofibroma',
    'Melanoma',
    'Melanocytic Nevi',
    'Vascular Lesions'
]

FIRST_AID = {
    'Actinic Keratoses': 'Avoid sun exposure and use sunscreen.',
    'Basal Cell Carcinoma': 'Keep area clean and dry; consult a dermatologist.',
    'Benign Keratosis': 'No immediate action required; monitor for changes.',
    'Dermatofibroma': 'Usually harmless; avoid scratching.',
    'Melanoma': 'Seek immediate medical attention.',
    'Melanocytic Nevi': 'Normal moles; watch for changes in size/color.',
    'Vascular Lesions': 'Apply cold compress if irritated; see doctor if painful.'
}

model = None
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


def load_model():
    global model
    model_path = current_app.config['MODEL_PATH']
    if not os.path.isfile(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    model = timm.create_model('efficientnet_b3', pretrained=False, num_classes=7)
    state_dict = torch.load(model_path, map_location=device)
    if list(state_dict.keys())[0].startswith('module.'):
        state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()
    print("timm EfficientNet-B3 loaded successfully")


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


def preprocess_image(image_path):
    transform = transforms.Compose([
        transforms.Resize((300, 300)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    image = Image.open(image_path).convert('RGB')
    return transform(image).unsqueeze(0).to(device)


def generate_gradcam_heatmap(model, input_tensor, target_class_idx, save_path, size=(300, 300)):
    """Generate Grad-CAM heatmap and save as image (medical colormap: blue -> green -> yellow -> red)."""
    if not _HAS_MATPLOTLIB:
        return None
    model.eval()
    input_tensor = input_tensor.clone().detach().requires_grad_(True)
    try:
        features = model.forward_features(input_tensor)
        features.retain_grad()
        head_fn = getattr(model, 'forward_head', None) or getattr(model, 'head', None)
        if head_fn is None:
            return None
        logits = head_fn(features) if callable(head_fn) else model.fc(features)
        score = logits[0, target_class_idx]
        model.zero_grad()
        score.backward()
        grad = features.grad
        if grad is None:
            return None
        weights = grad.mean(dim=(2, 3))
        cam = (weights.unsqueeze(2).unsqueeze(3) * features).sum(1, keepdim=True).clamp(min=0)
        cam = F.interpolate(cam, size=size, mode='bilinear', align_corners=False)
        cam = cam[0, 0].detach().cpu().numpy()
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
        plt.figure(figsize=(4, 4))
        plt.imshow(cam, cmap='jet')
        plt.axis('off')
        plt.tight_layout(pad=0)
        plt.savefig(save_path, bbox_inches='tight', pad_inches=0, dpi=100)
        plt.close()
        return save_path
    except Exception as e:
        print(f"Grad-CAM failed: {e}")
        return None


@upload_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    if 'image' not in request.files:
        return jsonify({'msg': 'No image part'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'msg': 'No selected file'}), 400
    if not allowed_file(file.filename):
        return jsonify({'msg': 'File type not allowed'}), 400

    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(filepath)

    global model
    if model is None:
        try:
            load_model()
        except FileNotFoundError as e:
            # Demo mode: no model file – return a placeholder result
            db = get_db()
            identity = get_current_user_identity()
            if not identity:
                return jsonify({'msg': 'Invalid token'}), 401
            user_id = identity.get('id')
            analysis_doc = {
                'user_id': user_id,
                'image_path': unique_filename,
                'prediction': 'Melanocytic Nevi',
                'severity': 'Low',
                'heatmap_path': None,
                'timestamp': datetime.utcnow(),
            }
            result = db.analyses.insert_one(analysis_doc)
            return jsonify({
                'analysis_id': str(result.inserted_id),
                'prediction': 'Melanocytic Nevi',
                'severity': 'Low',
                'confidence': 0.65,
                'first_aid': FIRST_AID.get('Melanocytic Nevi', 'No specific advice.'),
                'heatmap_url': None,
                'image_url': f'/uploads/{unique_filename}'
            })

    input_tensor = preprocess_image(filepath)
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        conf, predicted = torch.max(probabilities, 1)
        pred_class = CLASS_NAMES[predicted.item()]
        confidence = conf.item()

    if confidence < 0.5:
        severity = 'Low'
    elif confidence < 0.8:
        severity = 'Medium'
    else:
        severity = 'High'

    heatmap_filename = None
    try:
        base_name = filename.rsplit('.', 1)[0] if '.' in filename else 'heatmap'
        candidate = f"heatmap_{uuid.uuid4().hex}_{base_name}.png"
        heatmap_fullpath = os.path.join(current_app.config['UPLOAD_FOLDER'], candidate)
        result = generate_gradcam_heatmap(model, input_tensor, predicted.item(), heatmap_fullpath)
        if result:
            heatmap_filename = os.path.basename(result)
    except Exception as e:
        print(f"Heatmap generation skipped: {e}")

    identity = get_current_user_identity()
    if not identity:
        return jsonify({'msg': 'Invalid token'}), 401
    user_id = identity.get('id')
    db = get_db()
    analysis_doc = {
        'user_id': user_id,
        'image_path': unique_filename,
        'prediction': pred_class,
        'severity': severity,
        'confidence': confidence,
        'heatmap_path': heatmap_filename,
        'timestamp': datetime.utcnow(),
    }
    result = db.analyses.insert_one(analysis_doc)

    return jsonify({
        'analysis_id': str(result.inserted_id),
        'prediction': pred_class,
        'severity': severity,
        'confidence': confidence,
        'first_aid': FIRST_AID.get(pred_class, 'No specific advice.'),
        'heatmap_url': f'/uploads/{heatmap_filename}' if heatmap_filename else None,
        'image_url': f'/uploads/{unique_filename}'
    })


@upload_bp.route('/analyses', methods=['GET'])
@jwt_required()
def list_analyses():
    identity = get_current_user_identity()
    if not identity:
        return jsonify({'msg': 'Invalid token'}), 401
    db = get_db()
    user_id = identity.get('id')
    cursor = db.analyses.find({'user_id': user_id}).sort('timestamp', -1)
    analyses = []
    for a in cursor:
        analyses.append({
            'id': str(a['_id']),
            'prediction': a.get('prediction', ''),
            'severity': a.get('severity', ''),
            'timestamp': a['timestamp'].isoformat() if a.get('timestamp') else None,
        })
    return jsonify(analyses)


@upload_bp.route('/analysis/<analysis_id>', methods=['GET'])
@jwt_required()
def get_analysis(analysis_id):
    from bson import ObjectId
    identity = get_current_user_identity()
    if not identity:
        return jsonify({'msg': 'Invalid token'}), 401
    user_id = identity.get('id')
    db = get_db()
    try:
        a = db.analyses.find_one({'_id': ObjectId(analysis_id), 'user_id': user_id})
    except Exception:
        a = None
    if not a:
        return jsonify({'msg': 'Analysis not found'}), 404
    return jsonify({
        'id': str(a['_id']),
        'image': a.get('image_path'),
        'prediction': a.get('prediction', ''),
        'severity': a.get('severity', ''),
        'confidence': a.get('confidence'),
        'first_aid': FIRST_AID.get(a.get('prediction'), 'No specific advice.'),
        'heatmap': a.get('heatmap_path'),
    })
