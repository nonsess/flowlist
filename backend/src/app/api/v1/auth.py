from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException

from src.app.schemas.user import UserRead, UserRegister, UserLogin, Token
from src.app.core.deps import get_current_user, get_user_repository
from src.app.repositories.user import UserRepository
from src.app.core.security import verify_password, create_access_token


router = APIRouter()

@router.post("/register", response_model=Token)
async def register(
    user_in: UserRegister,
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
):
    existing = await user_repository.get_by_username(user_in.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    user = await user_repository.create(user_in.username, user_in.password)
    access_token = create_access_token(user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(
    user_in: UserLogin,
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
):
    user = await user_repository.get_by_username(user_in.username)
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(user.id)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserRead)
async def read_users_me(current_user: Annotated[UserRead, Depends(get_current_user)]):
    return current_user