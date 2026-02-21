from datetime import datetime
from bson import ObjectId

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required

from auth import get_current_user_identity
from mongo_db import get_db
from email_utils import send_email

consult_bp = Blueprint('consult', __name__)

razorpay_client = None


def init_razorpay(app):
    global razorpay_client
    if app.config.get('RAZORPAY_KEY_ID') and app.config.get('RAZORPAY_KEY_SECRET'):
        import razorpay
        razorpay_client = razorpay.Client(auth=(app.config['RAZORPAY_KEY_ID'], app.config['RAZORPAY_KEY_SECRET']))
    else:
        razorpay_client = None


@consult_bp.route('/doctors', methods=['GET'])
@jwt_required()
def get_doctors():
    db = get_db()
    doctors = list(db.users.find({'role': 'doctor'}))
    return jsonify([{
        'id': str(d['_id']),
        'name': d.get('name', ''),
        'phone': d.get('phone', ''),
        'is_online': d.get('is_online', False),
    } for d in doctors])


@consult_bp.route('/request', methods=['POST'])
@jwt_required()
def request_consultation():
    data = request.get_json() or {}
    identity = get_current_user_identity()
    if not identity:
        return jsonify({'msg': 'Invalid token'}), 401
    user_id = identity.get('id')
    if not user_id:
        return jsonify({'msg': 'Invalid token'}), 401
    doctor_id = data.get('doctor_id')
    analysis_id = data.get('analysis_id')
    consult_type = data.get('type') or 'chat'

    db = get_db()
    doctor = db.users.find_one({'_id': ObjectId(doctor_id)}) if doctor_id else None
    if not doctor or doctor.get('role') != 'doctor':
        return jsonify({'msg': 'Invalid doctor'}), 400

    try:
        aid = ObjectId(analysis_id)
    except Exception:
        return jsonify({'msg': 'Invalid analysis'}), 400
    analysis = db.analyses.find_one({'_id': aid, 'user_id': user_id})
    if not analysis:
        return jsonify({'msg': 'Invalid analysis'}), 400

    doc = {
        'user_id': user_id,
        'doctor_id': doctor_id,
        'analysis_id': analysis_id,
        'type': consult_type,
        'status': 'pending',
        'time_slot': None,
        'payment_id': None,
        'created_at': datetime.utcnow(),
    }
    result = db.consultations.insert_one(doc)
    consultation_id = str(result.inserted_id)

    user = db.users.find_one({'_id': ObjectId(user_id)})
    subject = "New Consultation Request"
    body = f"""
    <p>Dear Dr. {doctor.get('name', '')},</p>
    <p>You have a new consultation request from {user.get('name', '')}.</p>
    <p><strong>Disease:</strong> {analysis.get('prediction', '')}<br>
    <strong>Severity:</strong> {analysis.get('severity', '')}<br>
    <strong>Type:</strong> {consult_type}</p>
    <p>Please log in to your dashboard to accept or reject this request.</p>
    """
    if current_app.config.get('MAIL_USERNAME'):
        send_email(doctor.get('email', ''), subject, body)

    return jsonify({'consultation_id': consultation_id}), 201


def _serialize_consultation(r, db):
    user = db.users.find_one({'_id': ObjectId(r['user_id'])}) if r.get('user_id') else None
    doctor = db.users.find_one({'_id': ObjectId(r['doctor_id'])}) if r.get('doctor_id') else None
    analysis = db.analyses.find_one({'_id': ObjectId(r['analysis_id'])}) if r.get('analysis_id') else None
    return {
        'id': str(r['_id']),
        'user_name': user.get('name', '') if user else '',
        'doctor_name': doctor.get('name', '') if doctor else '',
        'disease': analysis.get('prediction') if analysis else None,
        'type': r.get('type'),
        'status': r.get('status'),
        'time_slot': r['time_slot'].isoformat() if r.get('time_slot') else None,
        'payment_id': r.get('payment_id'),
    }


@consult_bp.route('/requests', methods=['GET'])
@jwt_required()
def get_requests():
    current_user = get_current_user_identity()
    if not current_user:
        return jsonify({'msg': 'Invalid token'}), 401
    db = get_db()
    if current_user.get('role') == 'doctor':
        cursor = db.consultations.find({'doctor_id': current_user['id']})
    else:
        cursor = db.consultations.find({'user_id': current_user['id']})
    result = [_serialize_consultation(r, db) for r in cursor]
    return jsonify(result)


@consult_bp.route('/respond/<consult_id>', methods=['POST'])
@jwt_required()
def respond_to_request(consult_id):
    current_user = get_current_user_identity()
    if not current_user or current_user.get('role') != 'doctor':
        return jsonify({'msg': 'Unauthorized'}), 403

    data = request.get_json() or {}
    action = (data.get('action') or '').strip().lower()
    time_slot = data.get('time_slot') if action == 'accept' else None

    db = get_db()
    try:
        cid = ObjectId(consult_id)
    except Exception:
        return jsonify({'msg': 'Invalid consultation'}), 404
    consultation = db.consultations.find_one({'_id': cid})
    if not consultation:
        return jsonify({'msg': 'Not found'}), 404
    if str(consultation.get('doctor_id')) != str(current_user.get('id')):
        return jsonify({'msg': 'Not your request'}), 403

    if action == 'accept':
        update = {'status': 'accepted'}
        if time_slot:
            try:
                update['time_slot'] = datetime.fromisoformat(time_slot.replace('Z', '+00:00'))
            except Exception:
                update['time_slot'] = None
        db.consultations.update_one({'_id': cid}, {'$set': update})
        user = db.users.find_one({'_id': ObjectId(consultation['user_id'])})
        doctor = db.users.find_one({'_id': ObjectId(consultation['doctor_id'])})
        if user and current_app.config.get('MAIL_USERNAME'):
            subject = "Consultation Request Accepted"
            body = f"""
            <p>Dear {user.get('name', '')},</p>
            <p>Dr. {doctor.get('name', '')} has accepted your consultation request.</p>
            <p><strong>Type:</strong> {consultation.get('type', '')}<br>
            <strong>Scheduled time:</strong> {time_slot}</p>
            <p>Please proceed to payment on your dashboard.</p>
            """
            send_email(user.get('email', ''), subject, body)
    elif action == 'reject':
        db.consultations.update_one({'_id': cid}, {'$set': {'status': 'rejected'}})
        user = db.users.find_one({'_id': ObjectId(consultation['user_id'])})
        doctor = db.users.find_one({'_id': ObjectId(consultation['doctor_id'])})
        if user and current_app.config.get('MAIL_USERNAME'):
            subject = "Consultation Request Rejected"
            body = f"Dear {user.get('name', '')}, Dr. {doctor.get('name', '')} has rejected your consultation request."
            send_email(user.get('email', ''), subject, body)
    else:
        return jsonify({'msg': 'Invalid action'}), 400

    return jsonify({'msg': 'Response recorded'})


@consult_bp.route('/create-order', methods=['POST'])
@jwt_required()
def create_order():
    if not razorpay_client:
        return jsonify({'msg': 'Payment not configured'}), 503
    data = request.get_json() or {}
    consultation_id = data.get('consultation_id')
    if not consultation_id:
        return jsonify({'msg': 'consultation_id required'}), 400

    db = get_db()
    try:
        cid = ObjectId(consultation_id)
    except Exception:
        return jsonify({'msg': 'Invalid consultation'}), 404
    consultation = db.consultations.find_one({'_id': cid})
    identity = get_current_user_identity()
    if not identity or not consultation or str(consultation.get('user_id')) != str(identity.get('id')):
        return jsonify({'msg': 'Unauthorized'}), 403

    amount_map = {'chat': 30000, 'call': 50000, 'video': 100000}
    amount = amount_map.get(consultation.get('type'), 30000)
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
    if not razorpay_client:
        return jsonify({'msg': 'Payment not configured'}), 503
    data = request.get_json() or {}
    consultation_id = data.get('consultation_id')
    payment_id = data.get('payment_id')
    order_id = data.get('order_id')
    signature = data.get('signature')

    if not all([consultation_id, payment_id, order_id, signature]):
        return jsonify({'msg': 'Missing payment data'}), 400

    params_dict = {
        'razorpay_order_id': order_id,
        'razorpay_payment_id': payment_id,
        'razorpay_signature': signature
    }
    try:
        razorpay_client.utility.verify_payment_signature(params_dict)
    except Exception:
        return jsonify({'msg': 'Payment verification failed'}), 400

    db = get_db()
    try:
        cid = ObjectId(consultation_id)
    except Exception:
        return jsonify({'msg': 'Invalid consultation'}), 400
    db.consultations.update_one(
        {'_id': cid},
        {'$set': {'status': 'paid', 'payment_id': payment_id}}
    )
    consultation = db.consultations.find_one({'_id': cid})
    user = db.users.find_one({'_id': ObjectId(consultation['user_id'])}) if consultation else None
    doctor = db.users.find_one({'_id': ObjectId(consultation['doctor_id'])}) if consultation else None
    if user and doctor and current_app.config.get('MAIL_USERNAME'):
        subject = "Payment Successful - Consultation Confirmed"
        body = f"""
        <p>Dear {user.get('name', '')},</p>
        <p>Your payment for consultation with Dr. {doctor.get('name', '')} has been received.</p>
        <p>Consultation details:</p>
        <ul>
            <li>Type: {consultation.get('type', '')}</li>
            <li>Time: {consultation.get('time_slot')}</li>
        </ul>
        <p>Please log in to start the consultation.</p>
        """
        send_email(user.get('email', ''), subject, body)
        send_email(doctor.get('email', ''), subject, f"Dear Dr. {doctor.get('name', '')}, {user.get('name', '')} has completed payment for your consultation.")

    return jsonify({'msg': 'Payment verified and consultation confirmed'})
