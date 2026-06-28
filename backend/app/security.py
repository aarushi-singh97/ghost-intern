import hashlib
import hmac
import base64
import json
import os
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.database import get_connection


SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "change-this-secret-in-production",
)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24
bearer_scheme = HTTPBearer()


def base64_url_encode(data: bytes):
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def base64_url_decode(data: str):
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def hash_password(password: str):
    salt = os.urandom(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        120000,
    )
    return f"{salt.hex()}:{password_hash.hex()}"


def verify_password(password: str, stored_hash: str):
    salt_hex, hash_hex = stored_hash.split(":")
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt_hex),
        120000,
    )
    return hmac.compare_digest(
        password_hash.hex(),
        hash_hex,
    )


def create_access_token(user_id: int):
    expires_at = datetime.now(timezone.utc) + timedelta(
        hours=ACCESS_TOKEN_EXPIRE_HOURS
    )
    header = {
        "alg": ALGORITHM,
        "typ": "JWT",
    }
    payload = {
        "sub": str(user_id),
        "exp": int(expires_at.timestamp()),
    }
    encoded_header = base64_url_encode(
        json.dumps(header).encode("utf-8")
    )
    encoded_payload = base64_url_encode(
        json.dumps(payload).encode("utf-8")
    )
    signing_input = f"{encoded_header}.{encoded_payload}"
    signature = hmac.new(
        SECRET_KEY.encode("utf-8"),
        signing_input.encode("utf-8"),
        hashlib.sha256,
    ).digest()

    return (
        f"{signing_input}."
        f"{base64_url_encode(signature)}"
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    try:
        encoded_header, encoded_payload, encoded_signature = (
            credentials.credentials.split(".")
        )
        signing_input = f"{encoded_header}.{encoded_payload}"
        expected_signature = hmac.new(
            SECRET_KEY.encode("utf-8"),
            signing_input.encode("utf-8"),
            hashlib.sha256,
        ).digest()
        actual_signature = base64_url_decode(
            encoded_signature
        )
        is_valid_signature = hmac.compare_digest(
            expected_signature,
            actual_signature,
        )

        if not is_valid_signature:
            raise ValueError("Invalid token signature")

        payload = json.loads(
            base64_url_decode(encoded_payload)
        )

        if payload["exp"] < int(datetime.now(timezone.utc).timestamp()):
            raise ValueError("Token expired")

        user_id = int(payload["sub"])
    except Exception as exc:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        ) from exc

    with get_connection() as connection:
        user = connection.execute(
            """
            SELECT id, username, email, created_at
            FROM users
            WHERE id = ?
            """,
            (user_id,),
        ).fetchone()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    return dict(user)
