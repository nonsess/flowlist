from fastapi.security import HTTPBearer
from passlib.context import CryptContext
from datetime import datetime
from jose import jwt
from src.app.core.config import settings


oauth2_scheme = HTTPBearer()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    print('PASSWORD=',password)
    return pwd_context.hash(password)

def create_access_token(user_id: str) -> str:
    to_encode = {"sub": str(user_id), "exp": datetime.now() + settings.access_token_timedelta}
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALG)