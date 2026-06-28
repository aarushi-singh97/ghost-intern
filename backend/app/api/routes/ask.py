from fastapi import APIRouter, Depends

from app.models.request_models import ChatRequest

from app.security import get_current_user
from app.services.ai_service import (
    answer_question,
)


router = APIRouter(
    prefix="/ask",
    tags=["Ask"]
)


@router.post("/")
async def ask_question(
    request: ChatRequest,
    current_user=Depends(get_current_user),
):
    answer = answer_question(
        request.question,
        request.context
    )

    return {
        "answer": answer
    }
