from flask_restx import fields
from app.utils.api import api

hello_model = api.model('Hello', {
    "name": fields.String,
})