from fastapi import APIRouter, HTTPException

from app.database import get_connection
from app.models.request_models import LoginRequest, SignupRequest
from app.models.response_models import AuthResponse, UserResponse
from app.security import create_access_token, get_current_user, hash_password, verify_password
from fastapi import Depends


router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


def to_user_response(user):
    return UserResponse(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        created_at=user["created_at"],
    )


@router.post(
    "/signup",
    response_model=AuthResponse,
)
async def signup(request: SignupRequest):
    with get_connection() as connection:
        existing_user = connection.execute(
            """
            SELECT id FROM users
            WHERE username = ? OR email = ?
            """,
            (request.username, request.email),
        ).fetchone()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Username or email already exists",
            )

        cursor = connection.execute(
            """
            INSERT INTO users (username, email, hashed_password)
            VALUES (?, ?, ?)
            """,
            (
                request.username,
                request.email,
                hash_password(request.password),
            ),
        )
        user_id = cursor.lastrowid
        user = connection.execute(
            """
            SELECT id, username, email, created_at
            FROM users
            WHERE id = ?
            """,
            (user_id,),
        ).fetchone()

    return AuthResponse(
        token=create_access_token(user_id),
        user=to_user_response(user),
    )


@router.post(
    "/login",
    response_model=AuthResponse,
)
async def login(request: LoginRequest):
    with get_connection() as connection:
        user = connection.execute(
            """
            SELECT id, username, email, hashed_password, created_at
            FROM users
            WHERE email = ?
            """,
            (request.email,),
        ).fetchone()

    if not user or not verify_password(
        request.password,
        user["hashed_password"],
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    return AuthResponse(
        token=create_access_token(user["id"]),
        user=to_user_response(user),
    )


@router.post("/logout")
async def logout():
    return {
        "message": "Logged out successfully"
    }


@router.get(
    "/me",
    response_model=UserResponse,
)
async def me(current_user=Depends(get_current_user)):
    return current_user
