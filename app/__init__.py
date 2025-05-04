from flask import Flask
import os

# Utils
from .utils.db import db
from .utils.jwt import jwt
from .utils.api import api

# Config file
from .config import Config

# Routes
from .routes.hello import hello_ns
from .routes.auth import auth_ns

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    api.add_namespace(hello_ns)
    api.add_namespace(auth_ns)

    db.init_app(app)
    jwt.init_app(app)
    api.init_app(app)

    db_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'database')
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)

    if not os.path.exists(app.config['SQLALCHEMY_DATABASE_URI']):
        with app.app_context():
            db.create_all()

    return app
