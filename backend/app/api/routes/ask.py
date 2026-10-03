import json

from fastapi import APIRouter, Depends, HTTPException, Request

from app.models.request_models import ChatRequest

from app.security import get_current_user
from app.database import get_connection
from app.config import RATE_LIMIT_ASK
from app.rate_limit import limiter
from app.services.ai_service import (
    answer_question,
)


router = APIRouter(
    prefix="/ask",
    tags=["Ask"]
)


@router.post("/")
@limiter.limit(RATE_LIMIT_ASK)
async def ask_question(
    request: Request,
    payload: ChatRequest,
    current_user=Depends(get_current_user),
):
    with get_connection() as connection:
        row = connection.execute(
            "SELECT analysis_result FROM analyses WHERE id = ? AND user_id = ?",
            (payload.analysis_id, current_user["id"]),
        ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Analysis not found")
    answer = answer_question(payload.question, json.loads(row["analysis_result"]))

    return {
        "answer": answer
    }
