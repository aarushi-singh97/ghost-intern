import json

from fastapi import APIRouter, Depends

from app.database import get_connection
from app.security import get_current_user


router = APIRouter(
    prefix="/export",
    tags=["Export"],
)


@router.get("/")
async def export_data(
    current_user=Depends(get_current_user),
):
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, repository_url, repository_name, analysis_result,
                   created_at, user_id
            FROM analyses
            WHERE user_id = ?
            ORDER BY created_at DESC
            """,
            (current_user["id"],),
        ).fetchall()

    return {
        "profile": current_user,
        "analysis_history": [
            {
                "id": row["id"],
                "repository_url": row["repository_url"],
                "repository_name": row["repository_name"],
                "analysis_result": json.loads(row["analysis_result"]),
                "created_at": row["created_at"],
                "user_id": row["user_id"],
            }
            for row in rows
        ],
    }
