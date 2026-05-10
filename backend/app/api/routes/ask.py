from fastapi import APIRouter, HTTPException

from app.models.request_models import ChatRequest

from app.services.ai_service import (
    ask_repository_question,
)


router = APIRouter(
    prefix="/ask",
    tags=["Ask"]
)


@router.post("/")
async def ask_question(
    request: ChatRequest
):
    try:
        answer = ask_repository_question(
            request.question,
            request.context
        )

        return {
            "answer": answer
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )