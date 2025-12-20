import os
import jwt
from datetime import datetime, timedelta


SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM")

class JwtService:
    @staticmethod
    def generate_token(payload: dict):
        payload_with_exp = payload.copy()
        payload_with_exp.update({"exp": datetime.utcnow() + timedelta(days=1)})
        return jwt.encode(payload_with_exp, SECRET_KEY, algorithm=ALGORITHM)


    @staticmethod
    def verify_token(token: str):
        try:
            return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
        
    @staticmethod
    def get_user_id_from_token(token: str):
        payload = JwtService.verify_token(token)
        if payload:
            return payload.get("user_id")
        return None


