import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from models import db
from auth import auth_bp, bcrypt
from upload import upload_bp
from consultations import consult_bp, init_razorpay
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize extensions
    CORS(app, supports_credentials=True)
    db.init_app(app)
    Migrate(app, db)
    jwt = JWTManager(app)
    bcrypt.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(upload_bp, url_prefix='/api')
    app.register_blueprint(consult_bp, url_prefix='/consult')

    # Serve uploaded files
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    # Initialize Razorpay
    init_razorpay(app)

    # Create tables if they don't exist
    with app.app_context():
        db.create_all()

    @app.route('/health')
    def health():
        return jsonify({'status': 'ok'})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)