from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.schemas.user import UserRead
from src.app.repositories.task import TaskRepository
from src.app.repositories.user import UserRepository
from src.app.db.session import get_db
from src.app.repositories.user import UserRepository
from src.app.core.security import oauth2_scheme
from src.app.core.config import settings

async def get_task_repository(
    db: Annotated[AsyncSession, Depends(get_db)]
):
    return TaskRepository(db)

async def get_user_repository(
    db: Annotated[AsyncSession, Depends(get_db)]
):
    return UserRepository(db)

async def get_current_lazy_token(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(oauth2_scheme)]
):
    return credentials.credentials

async def get_current_user(
    token: Annotated[str, Depends(get_current_lazy_token)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> UserRead:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    if user is None:
        raise credentials_exception
    return UserRead.model_validate(user)