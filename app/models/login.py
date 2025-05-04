from app.utils.db import db
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

class UserLogin(db.Model):
    id        = db.Column(db.Integer, primary_key=True)
    username  = db.Column(db.String(100), unique=True)
    password  = db.Column(db.String(255))
    create_at = db.Column(db.DateTime, default=datetime.datetime.now)
    user_rol  = db.Column(db.String(30), default='Pending')

    def __init__(self, username, password):
        self.username= username
        self.password = self.create_password(password)

    def create_password(self, password):
        return generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password, password)

    def get_id(self):
        return self.id 