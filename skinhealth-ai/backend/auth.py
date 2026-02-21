import json
import logging

from flask import Blueprint, request, jsonify, current_app
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from bson import ObjectId

from mongo_db import get_db

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()
logger = logging.getLogger(__name__)


def _handle_db_error(e):
    """Return a 503 response when MongoDB is unreachable."""
    return jsonify({'msg': 'Database kedaikala. Is MongoDB running on localhost:27017?'}), 503


def _normalize_identity(current_user):
    """Flask-JWT-Extended may return identity as dict or as JSON string."""
    if current_user is None:
        return None
    if isinstance(current_user, dict):
        return current_user
    if isinstance(current_user, str):
        try:
            return json.loads(current_user)
        except Exception:
            return None
    return None


def get_current_user_identity():
    """Use this in other blueprints to get {id, role} dict from JWT."""
    return _normalize_identity(get_jwt_identity())


@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json() or {}
    except Exception:
        data = {}
    email = (data.get('email') or '').strip()
    password = data.get('password')
    name = (data.get('name') or '').strip()
    role = (data.get('role') or 'user').strip().lower()
    phone = (data.get('phone') or '').strip()

    if not email or not password or not name:
        return jsonify({'msg': 'Missing fields (email, password, name required)'}), 400

    if not isinstance(password, str):
        password = str(password) if password is not None else ''

    if role not in ('user', 'doctor'):
        role = 'user'

    try:
        db = get_db()
        users = db.users
    except Exception as e:
        logger.exception("Register: get_db failed")
        return _handle_db_error(e)

    try:
        if users.find_one({'email': email}):
            return jsonify({'msg': 'Email already registered'}), 400

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        doc = {
            'email': email,
            'password_hash': password_hash,
            'name': name,
            'role': role,
            'phone': phone or '',
            'is_online': False,
        }
        users.insert_one(doc)
        return jsonify({'msg': 'User created successfully'}), 201
    except Exception as e:
        logger.exception("Register failed: %s", e)
        try:
            from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
            if isinstance(e, (ServerSelectionTimeoutError, ConnectionFailure)):
                return _handle_db_error(e)
        except ImportError:
            pass
        # Return 500 with a safe message; real error is in server logs
        msg = 'Registration failed. Check backend terminal for details.'
        if current_app.debug:
            msg = str(e)
        return jsonify({'msg': msg}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
    except Exception:
        data = {}
    email = (data.get('email') or '').strip()
    password = data.get('password')

    if not email or not password:
        return jsonify({'msg': 'Email and password required'}), 400

    if not isinstance(password, str):
        password = str(password) if password is not None else ''

    try:
        db = get_db()
        users = db.users
        user = users.find_one({'email': email})
    except Exception as e:
        from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
        if isinstance(e, (ServerSelectionTimeoutError, ConnectionFailure)):
            return _handle_db_error(e)
        raise

    if not user or not bcrypt.check_password_hash(user['password_hash'], password):
        return jsonify({'msg': 'Invalid credentials'}), 401

    user_id = str(user['_id'])
    # Store identity as JSON string so JWT decoding always returns consistent format
    identity = json.dumps({'id': user_id, 'role': user['role']})
    access_token = create_access_token(identity=identity)
    return jsonify({'access_token': access_token, 'role': user['role']}), 200


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    raw_identity = get_jwt_identity()
    current_user = _normalize_identity(raw_identity)
    if not current_user or not isinstance(current_user, dict):
        return jsonify({'msg': 'Invalid token'}), 401
    user_id = current_user.get('id')
    if not user_id:
        return jsonify({'msg': 'Invalid token'}), 401
    try:
        oid = ObjectId(str(user_id))
    except Exception:
        return jsonify({'msg': 'Invalid token'}), 401
    try:
        db = get_db()
        user = db.users.find_one({'_id': oid})
    except Exception as e:
        logger.exception("Profile: get_db failed")
        return _handle_db_error(e)
    if not user:
        return jsonify({'msg': 'User not found'}), 404
    return jsonify({
        'id': str(user['_id']),
        'email': user['email'],
        'name': user['name'],
        'role': user['role'],
        'phone': user.get('phone', ''),
        'is_online': user.get('is_online', False),
    })
