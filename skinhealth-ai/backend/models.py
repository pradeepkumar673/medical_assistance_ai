from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'user' or 'doctor'
    phone = db.Column(db.String(20))                 # optional for doctors
    is_online = db.Column(db.Boolean, default=False)  # simple online status
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Analysis(db.Model):
    __tablename__ = 'analyses'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    image_path = db.Column(db.String(200), nullable=False)
    prediction = db.Column(db.String(50), nullable=False)   # disease class
    severity = db.Column(db.String(10), nullable=False)     # Low/Medium/High
    heatmap_path = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Consultation(db.Model):
    __tablename__ = 'consultations'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    analysis_id = db.Column(db.Integer, db.ForeignKey('analyses.id'))
    type = db.Column(db.String(20))           # chat, call, video
    status = db.Column(db.String(20), default='pending')  # pending, accepted, rejected, paid
    time_slot = db.Column(db.DateTime)
    payment_id = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)