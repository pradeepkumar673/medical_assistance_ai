import os
import torch
import torchvision.transforms as transforms
from PIL import Image
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import numpy as np
from models import db, User, Analysis
import uuid
import timm  # <-- Add timm to your requirements.txt

# Optional: for Grad-CAM heatmaps (uncomment if you have torchcam installed)
# try:
#     from torchcam.methods import GradCAM
# except ImportError:
#     GradCAM = None

upload_bp = Blueprint('upload', __name__)

# 7 disease classes (HAM10000) – ensure this order matches your model's training order
CLASS_NAMES = [
    'Actinic Keratoses',
    'Basal Cell Carcinoma',
    'Benign Keratosis',
    'Dermatofibroma',
    'Melanoma',
    'Melanocytic Nevi',
    'Vascular Lesions'
]

# First‑aid tips (static, for demo only)
FIRST_AID = {
    'Actinic Keratoses': 'Avoid sun exposure and use sunscreen.',
    'Basal Cell Carcinoma': 'Keep area clean and dry; consult a dermatologist.',
    'Benign Keratosis': 'No immediate action required; monitor for changes.',
    'Dermatofibroma': 'Usually harmless; avoid scratching.',
    'Melanoma': 'Seek immediate medical attention.',
    'Melanocytic Nevi': 'Normal moles; watch for changes in size/color.',
    'Vascular Lesions': 'Apply cold compress if irritated; see doctor if painful.'
}

# Load model once (global variable)
model = None
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def load_model():
    """Load the timm EfficientNet-B3 model from the .pth file."""
    global model
    model_path = current_app.config['MODEL_PATH']

    # Create the model using timm (exact architecture used during training)
    model = timm.create_model('efficientnet_b3', pretrained=False, num_classes=7)
    
    # Load state dict
    state_dict = torch.load(model_path, map_location=device)
    
    # Handle DataParallel wrapping by removing 'module.' prefix if present
    if list(state_dict.keys())[0].startswith('module.'):
        state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}
    
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()
    print("timm EfficientNet-B3 loaded successfully")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def preprocess_image(image_path):
    """Preprocess image for EfficientNet-B3: resize to 300x300 and normalize."""
    transform = transforms.Compose([
        transforms.Resize((300, 300)),          # EfficientNet-B3 input size
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        # If you used different mean/std during training, replace the values above.
    ])
    image = Image.open(image_path).convert('RGB')
    return transform(image).unsqueeze(0).to(device)

def generate_heatmap(model, input_tensor, target_class):
    """Generate Grad-CAM heatmap (placeholder – requires torchcam)."""
    # Uncomment if you have torchcam installed and want heatmaps
    # if GradCAM is None:
    #     return None
    # # Choose a convolutional layer – for EfficientNet-B3, try 'blocks' or a specific block
    # cam_extractor = GradCAM(model, target_layer='blocks')  # adjust layer name
    # with torch.no_grad():
    #     out = model(input_tensor)
    # activation_map = cam_extractor(out.argmax().item(), out)
    # # Convert to numpy and save as image (simplified)
    # heatmap = activation_map[0].cpu().numpy()
    # # ... (code to save heatmap image) ...
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
    # Generate unique filename to avoid collisions
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(filepath)

    # Load model if not already loaded
    global model
    if model is None:
        load_model()

    # Preprocess and predict
    input_tensor = preprocess_image(filepath)
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        conf, predicted = torch.max(probabilities, 1)
        pred_class = CLASS_NAMES[predicted.item()]
        confidence = conf.item()

    # Severity based on confidence
    if confidence < 0.5:
        severity = 'Low'
    elif confidence < 0.8:
        severity = 'Medium'
    else:
        severity = 'High'

    # Generate heatmap (optional)
    heatmap_filename = None
    # if GradCAM:
    #     heatmap = generate_heatmap(model, input_tensor, predicted.item())
    #     if heatmap is not None:
    #         heatmap_filename = f"heatmap_{unique_filename}"
    #         heatmap_path = os.path.join(current_app.config['UPLOAD_FOLDER'], heatmap_filename)
    #         # Save heatmap image (code omitted for brevity)

    # Save analysis to DB
    user_id = get_jwt_identity()['id']
    analysis = Analysis(
        user_id=user_id,
        image_path=unique_filename,
        prediction=pred_class,
        severity=severity,
        heatmap_path=heatmap_filename
    )
    db.session.add(analysis)
    db.session.commit()

    return jsonify({
        'analysis_id': analysis.id,
        'prediction': pred_class,
        'severity': severity,
        'confidence': confidence,
        'first_aid': FIRST_AID.get(pred_class, 'No specific advice.'),
        'heatmap_url': f'/uploads/{heatmap_filename}' if heatmap_filename else None,
        'image_url': f'/uploads/{unique_filename}'
    })