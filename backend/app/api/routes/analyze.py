import json

from fastapi import APIRouter, Depends, HTTPException

from app.models.request_models import RepoRequest
from app.models.response_models import AnalysisHistoryItem, RepoAnalysisResponse

from app.database import get_connection
from app.security import get_current_user
from app.services.github_service import fetch_repository_data
from app.services.tech_detector import detect_technologies
from app.services.ai_service import generate_repository_summary


router = APIRouter(
    prefix="/analyze",
    tags=["Analyze"]
)


@router.post(
    "/",
    response_model=RepoAnalysisResponse
)
async def analyze_repo(
    request: RepoRequest,
    current_user=Depends(get_current_user),
):
    try:
        repo_data = fetch_repository_data(
            request.repo_url
        )

        tech_stack = detect_technologies(
            repo_data["package_json"],
            repo_data["requirements_text"],
        )

        ai_summary = generate_repository_summary(
            repo_data["readme"],
            tech_stack
        )

        analysis = RepoAnalysisResponse(
            repo=repo_data["repo"],
            techStack=tech_stack,
            keyFiles=repo_data["key_files"],
            summary=ai_summary,
            architectureNotes=repo_data["architecture"]["notes"],
            architecture=repo_data["architecture"],
        )
        analysis_json = analysis.model_dump_json()

        with get_connection() as connection:
            connection.execute(
                """
                INSERT INTO analyses (
                    repository_url,
                    repository_name,
                    analysis_result,
                    user_id
                )
                VALUES (?, ?, ?, ?)
                """,
                (
                    request.repo_url,
                    f"{analysis.repo.owner}/{analysis.repo.name}",
                    analysis_json,
                    current_user["id"],
                ),
            )

        return analysis

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        print(f"Repository analysis failed: {error}")
        raise HTTPException(
            status_code=500,
            detail="Repository analysis failed. Please try again.",
        ) from error


@router.get(
    "/history",
    response_model=list[AnalysisHistoryItem],
)
async def get_analysis_history(
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

    return [
        AnalysisHistoryItem(
            id=row["id"],
            repository_url=row["repository_url"],
            repository_name=row["repository_name"],
            analysis_result=json.loads(row["analysis_result"]),
            created_at=row["created_at"],
            user_id=row["user_id"],
        )
        for row in rows
    ]
