import sqlite3
from contextlib import contextmanager
from pathlib import Path


DATABASE_PATH = Path(__file__).resolve().parent.parent / "ghost_intern.db"


@contextmanager
def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")

    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def init_db():
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                hashed_password TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.execute("CREATE TABLE IF NOT EXISTS revoked_tokens (jti TEXT PRIMARY KEY, expires_at INTEGER NOT NULL)")
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                repository_url TEXT NOT NULL,
                repository_name TEXT NOT NULL,
                repository_owner TEXT,
                repository_slug TEXT,
                languages TEXT NOT NULL DEFAULT '{}',
                analysis_result TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
            """
        )
        for column, definition in (("repository_owner", "TEXT"), ("repository_slug", "TEXT"), ("languages", "TEXT NOT NULL DEFAULT '{}'")):
            try:
                connection.execute(f"ALTER TABLE analyses ADD COLUMN {column} {definition}")
            except sqlite3.OperationalError:
                pass
        connection.execute("CREATE INDEX IF NOT EXISTS idx_analyses_user_created ON analyses(user_id, created_at DESC)")
