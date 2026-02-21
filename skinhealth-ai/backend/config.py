import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    # Use at least 32 bytes for HMAC-SHA256 to avoid JWT warnings and 422 on /auth/profile
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'skinhealth-ai-jwt-secret-key-min-32-chars'
    JWT_ACCESS_TOKEN_EXPIRES = 60 * 60 * 24 * 7  # 7 days (avoids 422 from expired token right after login)

    # MongoDB
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
    MONGO_DB_NAME = os.environ.get('MONGO_DB_NAME', 'skinhealth_ai')

    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

    # Email settings (Gmail)
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')

    # Razorpay (optional; set in env for payment features)
    RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID') or ''
    RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET') or ''

    MODEL_PATH = os.environ.get('MODEL_PATH', './model.pth')
