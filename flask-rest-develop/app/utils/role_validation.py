from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt
def role_required(role):
    def decorator(fn):
        @jwt_required()
        @wraps(fn)
        def wrapper(*args, **kwargs):
            current_role = get_jwt()
            if current_role["role"] not in role:
                return {"message": "No estas autorizado."}, 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator