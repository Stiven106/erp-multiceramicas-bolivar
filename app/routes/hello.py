from flask import request
from flask_restx import Namespace, Resource
from app.models.hello import hello_model

hello_ns = Namespace('Hello', description='Hello World! Template', path='/api/v1/hello')

@hello_ns.route('/', methods=['GET', 'POST'])
class Token(Resource):
    @hello_ns.doc(description='Greetings from Flask Rest.', responses={200: 'Success'})
    
    def get(self):
        return {'message': 'Hello from Flask!'}, 200
    
    @hello_ns.doc(description='Greetings with name from Flask Rest.', responses={200: 'Success'})
    @hello_ns.expect(hello_model)

    def post(self):
        data     = request.get_json()
        username = data['name']

        return {'message': f'Hello from Flask, {username}!'}, 200
        
