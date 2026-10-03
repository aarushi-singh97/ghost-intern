from fastapi import FastAPI, Request
from fastapi.middleware.cors import (
    CORSMiddleware,
)

from app.api.routes import (
    analyze,
    ask,
    auth,
    export,
)
from app.database import init_db
from app.config import CORS_ORIGINS
from app.rate_limit import limiter
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

app = FastAPI(
    title="Ghost Intern API",
    version="1.0.0",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


app.add_middleware(
    CORSMiddleware,

    allow_origins=CORS_ORIGINS,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


app.include_router(analyze.router)
app.include_router(ask.router)
app.include_router(auth.router)
app.include_router(export.router)


@app.on_event("startup")
async def startup():
    init_db()


@app.get("/")
async def root():
    return {
        "message":
        "Ghost Intern backend running"
    }
