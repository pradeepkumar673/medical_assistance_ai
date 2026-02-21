
from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role')        # 'user' or 'doctor'
    phone = data.get('phone', '')

    if not email or not password or not name or not role:
        return jsonify({'msg': 'Missing fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'Email already registered'}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, password_hash=password_hash, name=name, role=role, phone=phone)
    db.session.add(user)
    db.session.commit()

    return jsonify({'msg': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'msg': 'Invalid credentials'}), 401

    access_token = create_access_token(identity={'id': user.id, 'role': user.role})
    return jsonify({'access_token': access_token, 'role': user.role}), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    user = User.query.get(current_user['id'])
    return jsonify({
        'id': user.id,
        'email': user.email,
        'name': user.name,
        'role': user.role,
        'phone': user.phone,
        'is_online': user.is_online
    })