from fastapi import APIRouter

from app.core.security import CurrentUserDependency
from app.schemas.auth import CurrentUser

router = APIRouter()


@router.get("/me", response_model=CurrentUser)
async def get_me(current_user: CurrentUserDependency) -> CurrentUser:
    return current_user
