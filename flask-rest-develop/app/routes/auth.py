from flask import request
from flask_jwt_extended import create_access_token
from flask_restx import Namespace, Resource
from app.models.login import UserLogin
from app.models.api_models import auth_model
from app.utils.db import db
from app.utils.role_validation import role_required

auth_ns = Namespace('Auth', description='Endpoints para autenticación', path='/api/v1/auth')

@auth_ns.route('/token', methods=['POST'])
class Token(Resource):
    @auth_ns.doc(description='Autenticarse y obtener token de acceso.', responses={200: 'Success', 401: 'Unauthorized'})
    @auth_ns.expect(auth_model)
    
    def post(self):
        data     = request.get_json()
        username = data['username']
        password = data['password']

        user = UserLogin.query.filter_by(username=username).first()

        if user is not None and user.verify_password(password):
            additional_claims = {'role': user.user_rol}
            access_token = create_access_token(identity=user.id, additional_claims=additional_claims)
            return {'user_id': user.id, 'user_role': user.user_rol, 'token': access_token}, 200
        else:
            return {'response': 'Usuario o contraseña incorrectos.'}, 401
        
@auth_ns.route('/create_user', methods=['POST'])
class CreateUser(Resource):
    @auth_ns.doc(description='Crear nuevo usuario.', responses={200: 'Success'})
    @auth_ns.expect(auth_model)
    # TODO: Uncomment the role_required decorator when the first user is created.
    # @role_required(['admin'])
    def post(self):
        data     = request.get_json()
        username = data['username']
        password = data['password']

        user = UserLogin.query.filter_by(username=username).first()

        if user is None:
            user = UserLogin(username=username, password=password)
            db.session.add(user)
            db.session.commit()

            return {'user_id': user.id, 'user_name': user.username, 'user_role': user.user_rol}, 200
        else:
            return {'message': 'Usuario ya existe.'}, 200