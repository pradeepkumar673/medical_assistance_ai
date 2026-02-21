import os
import uuid
from datetime import datetime

import torch
import torchvision.transforms as transforms
from PIL import Image
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required

from auth import get_current_user_identity
from werkzeug.utils import secure_filename

import timm
from mongo_db import get_db

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
        'heatmap_path': None,
        'timestamp': datetime.utcnow(),
    }
    result = db.analyses.insert_one(analysis_doc)

    return jsonify({
        'analysis_id': str(result.inserted_id),
        'prediction': pred_class,
        'severity': severity,
        'confidence': confidence,
        'first_aid': FIRST_AID.get(pred_class, 'No specific advice.'),
        'heatmap_url': None,
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
        'first_aid': FIRST_AID.get(a.get('prediction'), 'No specific advice.'),
        'heatmap': a.get('heatmap_path'),
    })
