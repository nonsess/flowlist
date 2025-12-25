from src.app.repositories.task import TaskRepository
from src.app.schemas.task import TaskCreate


async def add_welcome_tasks(
    user_id: int,
    task_repository: TaskRepository
) -> None:
    await task_repository.create(TaskCreate(
        title="Ты можешь изменить заголовок и описание задачи",
        description="Просто нажми на них"
    ), user_id)

    await task_repository.create(TaskCreate(
        title="Добро пожаловать в Flowlist",
        description="Здесь ты можешь управлять своими задачами"
    ), user_id)