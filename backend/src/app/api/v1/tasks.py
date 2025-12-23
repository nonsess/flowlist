from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID

from src.app.models.user import User
from src.app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from src.app.repositories.task import TaskRepository
from src.app.core.deps import get_current_user, get_task_repository


router = APIRouter()

@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    task_repository: Annotated[TaskRepository, Depends(get_task_repository)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    task = await task_repository.create(task_in, current_user.id)
    return task

@router.get("/", response_model=List[TaskRead], status_code=status.HTTP_200_OK)
async def get_tasks(
    task_repository: Annotated[TaskRepository, Depends(get_task_repository)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    tasks = await task_repository.list_all(current_user.id)
    return tasks

@router.get("/{task_id}", response_model=TaskRead, status_code=status.HTTP_200_OK)
async def get_task(
    task_id: UUID,
    task_repository: Annotated[TaskRepository, Depends(get_task_repository)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    task = await task_repository.get_by_id(task_id, current_user.id)
    return task

@router.patch("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: UUID,
    task_update: TaskUpdate,
    task_repository: Annotated[TaskRepository, Depends(get_task_repository)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    task = await task_repository.update(task_id, task_update, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: UUID,
    task_repository: Annotated[TaskRepository, Depends(get_task_repository)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    if not await task_repository.delete(task_id, current_user.id):
        raise HTTPException(404)