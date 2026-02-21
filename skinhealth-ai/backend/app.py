import os
from flask import Flask, send_from_directory, jsonify, g
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from auth import auth_bp, bcrypt
from upload import upload_bp
from consultations import consult_bp, init_razorpay
from config import Config


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'http://127.0.0.1:5173'])
    JWTManager(app)
    bcrypt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(upload_bp, url_prefix='/api')
    app.register_blueprint(consult_bp, url_prefix='/consult')

    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    init_razorpay(app)

    @app.teardown_appcontext
    def teardown_mongo(exception=None):
        client = g.pop('mongo_client', None)
        if client is not None:
            try:
                client.close()
            except Exception:
                pass

    @app.route('/health')
    def health():
        try:
            from mongo_db import get_db
            get_db().users.find_one({})
            return jsonify({'status': 'ok', 'database': 'connected'})
        except Exception:
            return jsonify({'status': 'ok', 'database': 'disconnected'}), 503

    @app.errorhandler(500)
    def handle_500(err):
        app.logger.exception(err)
        return jsonify({'msg': 'Internal server error. Check the backend terminal for details.'}), 500

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
