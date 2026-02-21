from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Analysis, Consultation
from datetime import datetime
import razorpay
from email_utils import send_email
import json

consult_bp = Blueprint('consult', __name__)

# Initialize Razorpay client
razorpay_client = None

def init_razorpay(app):
    global razorpay_client
    razorpay_client = razorpay.Client(auth=(app.config['RAZORPAY_KEY_ID'], app.config['RAZORPAY_KEY_SECRET']))

@consult_bp.route('/doctors', methods=['GET'])
@jwt_required()
def get_doctors():
    doctors = User.query.filter_by(role='doctor').all()
    return jsonify([{
        'id': d.id,
        'name': d.name,
        'phone': d.phone,
        'is_online': d.is_online
    } for d in doctors])

@consult_bp.route('/request', methods=['POST'])
@jwt_required()
def request_consultation():
    data = request.get_json()
    user_id = get_jwt_identity()['id']
    doctor_id = data.get('doctor_id')
    analysis_id = data.get('analysis_id')
    consult_type = data.get('type')  # chat/call/video

    # Validate
    doctor = User.query.get(doctor_id)
    if not doctor or doctor.role != 'doctor':
        return jsonify({'msg': 'Invalid doctor'}), 400

    analysis = Analysis.query.get(analysis_id)
    if not analysis or analysis.user_id != user_id:
        return jsonify({'msg': 'Invalid analysis'}), 400

    consultation = Consultation(
        user_id=user_id,
        doctor_id=doctor_id,
        analysis_id=analysis_id,
        type=consult_type,
        status='pending'
    )
    db.session.add(consultation)
    db.session.commit()

    # Send email to doctor
    user = User.query.get(user_id)
    subject = "New Consultation Request"
    body = f"""
    <p>Dear Dr. {doctor.name},</p>
    <p>You have a new consultation request from {user.name}.</p>
    <p><strong>Disease:</strong> {analysis.prediction}<br>
    <strong>Severity:</strong> {analysis.severity}<br>
    <strong>Type:</strong> {consult_type}</p>
    <p>Please log in to your dashboard to accept or reject this request.</p>
    """
    send_email(doctor.email, subject, body)

    return jsonify({'consultation_id': consultation.id}), 201

@consult_bp.route('/requests', methods=['GET'])
@jwt_required()
def get_requests():
    current_user = get_jwt_identity()
    if current_user['role'] == 'doctor':
        # Doctor sees pending requests assigned to them
        requests = Consultation.query.filter_by(doctor_id=current_user['id']).all()
    else:
        # User sees their own requests
        requests = Consultation.query.filter_by(user_id=current_user['id']).all()

    result = []
    for r in requests:
        user = User.query.get(r.user_id)
        doctor = User.query.get(r.doctor_id)
        analysis = Analysis.query.get(r.analysis_id)
        result.append({
            'id': r.id,
            'user_name': user.name,
            'doctor_name': doctor.name,
            'disease': analysis.prediction if analysis else None,
            'type': r.type,
            'status': r.status,
            'time_slot': r.time_slot.isoformat() if r.time_slot else None,
            'payment_id': r.payment_id
        })
    return jsonify(result)

@consult_bp.route('/respond/<int:consult_id>', methods=['POST'])
@jwt_required()
def respond_to_request(consult_id):
    current_user = get_jwt_identity()
    if current_user['role'] != 'doctor':
        return jsonify({'msg': 'Unauthorized'}), 403

    data = request.get_json()
    action = data.get('action')  # 'accept' or 'reject'
    time_slot = data.get('time_slot') if action == 'accept' else None

    consultation = Consultation.query.get_or_404(consult_id)
    if consultation.doctor_id != current_user['id']:
        return jsonify({'msg': 'Not your request'}), 403

    if action == 'accept':
        consultation.status = 'accepted'
        consultation.time_slot = datetime.fromisoformat(time_slot) if time_slot else None
        db.session.commit()
        # Notify user
        user = User.query.get(consultation.user_id)
        doctor = User.query.get(consultation.doctor_id)
        subject = "Consultation Request Accepted"
        body = f"""
        <p>Dear {user.name},</p>
        <p>Dr. {doctor.name} has accepted your consultation request.</p>
        <p><strong>Type:</strong> {consultation.type}<br>
        <strong>Scheduled time:</strong> {time_slot}</p>
        <p>Please proceed to payment on your dashboard.</p>
        """
        send_email(user.email, subject, body)
    elif action == 'reject':
        consultation.status = 'rejected'
        db.session.commit()
        user = User.query.get(consultation.user_id)
        doctor = User.query.get(consultation.doctor_id)
        subject = "Consultation Request Rejected"
        body = f"Dear {user.name}, Dr. {doctor.name} has rejected your consultation request."
        send_email(user.email, subject, body)
    else:
        return jsonify({'msg': 'Invalid action'}), 400

    return jsonify({'msg': 'Response recorded'})

@consult_bp.route('/create-order', methods=['POST'])
@jwt_required()
def create_order():
    data = request.get_json()
    consultation_id = data.get('consultation_id')
    consultation = Consultation.query.get_or_404(consultation_id)

    # Verify user owns this consultation
    if consultation.user_id != get_jwt_identity()['id']:
        return jsonify({'msg': 'Unauthorized'}), 403

    # Amount based on consultation type (in paise)
    amount_map = {'chat': 30000, 'call': 50000, 'video': 100000}  # ₹300, ₹500, ₹1000
    amount = amount_map.get(consultation.type, 30000)

    # Create Razorpay order
    order_data = {
        'amount': amount,
        'currency': 'INR',
        'receipt': f'consult_{consultation_id}',
        'payment_capture': 1
    }
    order = razorpay_client.order.create(order_data)

    return jsonify({
        'order_id': order['id'],
        'amount': amount,
        'key_id': current_app.config['RAZORPAY_KEY_ID']
    })

@consult_bp.route('/verify-payment', methods=['POST'])
@jwt_required()
def verify_payment():
    data = request.get_json()
    consultation_id = data.get('consultation_id')
    payment_id = data.get('payment_id')
    order_id = data.get('order_id')
    signature = data.get('signature')

    # Verify signature (optional but recommended)
    params_dict = {
        'razorpay_order_id': order_id,
        'razorpay_payment_id': payment_id,
        'razorpay_signature': signature
    }
    try:
        razorpay_client.utility.verify_payment_signature(params_dict)
    except:
        return jsonify({'msg': 'Payment verification failed'}), 400

    consultation = Consultation.query.get(consultation_id)
    consultation.status = 'paid'
    consultation.payment_id = payment_id
    db.session.commit()

    # Notify both parties
    user = User.query.get(consultation.user_id)
    doctor = User.query.get(consultation.doctor_id)
    subject = "Payment Successful - Consultation Confirmed"
    body = f"""
    <p>Dear {user.name},</p>
    <p>Your payment for consultation with Dr. {doctor.name} has been received.</p>
    <p>Consultation details:</p>
    <ul>
        <li>Type: {consultation.type}</li>
        <li>Time: {consultation.time_slot}</li>
    </ul>
    <p>Please log in to start the consultation.</p>
    """
    send_email(user.email, subject, body)

    doctor_body = f"Dear Dr. {doctor.name}, {user.name} has completed payment for your consultation."
    send_email(doctor.email, subject, doctor_body)

    return jsonify({'msg': 'Payment verified and consultation confirmed'})