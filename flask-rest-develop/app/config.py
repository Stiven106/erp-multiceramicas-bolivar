from dotenv import load_dotenv, find_dotenv
from datetime import timedelta
import os

load_dotenv(find_dotenv())

class Config:
    base_dir = os.path.abspath(os.path.dirname(__file__))
    db_path  = os.path.join(base_dir, 'database', os.environ.get('DB_NAME'))

    SQLALCHEMY_DATABASE_URI         = 'sqlite:///' + db_path
    SQLALCHEMY_TRACK_MODIFICATIONS  = False
    JWT_ACCESS_TOKEN_EXPIRES        = timedelta(minutes=30)
    SESSION_REFRESH_EACH_REQUEST    = True
    JWT_SECRET_KEY                  = os.environ.get('JWT_KEY')