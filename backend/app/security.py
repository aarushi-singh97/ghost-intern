import hashlib
import hmac
import os
import uuid
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import JWT_SECRET_KEY
from app.database import get_connection

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24
bearer_scheme = HTTPBearer()


def hash_password(password: str):
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 310000)
    return f"{salt.hex()}:{digest.hex()}"


def verify_password(password: str, stored_hash: str):
    try:
        salt_hex, stored_digest = stored_hash.split(":")
        digest = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt_hex), 310000)
        return hmac.compare_digest(digest.hex(), stored_digest)
    except (ValueError, TypeError):
        return False


def create_access_token(user_id: int):
    expires_at = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    return jwt.encode({"sub": str(user_id), "exp": expires_at, "jti": str(uuid.uuid4())}, JWT_SECRET_KEY, algorithm=ALGORITHM)


def revoke_token(token: str):
    payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
    with get_connection() as connection:
        connection.execute("INSERT OR IGNORE INTO revoked_tokens (jti, expires_at) VALUES (?, ?)", (payload["jti"], payload["exp"]))


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        with get_connection() as connection:
            revoked = connection.execute("SELECT 1 FROM revoked_tokens WHERE jti = ?", (payload["jti"],)).fetchone()
            user = connection.execute("SELECT id, username, email, created_at FROM users WHERE id = ?", (int(payload["sub"]),)).fetchone()
        if revoked or not user:
            raise ValueError("Invalid token")
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc
    return dict(user)
