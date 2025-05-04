from flask_restx import fields
from app.utils.api import api

auth_model = api.model('Auth', {
    "username": fields.String,
    "password": fields.String
})