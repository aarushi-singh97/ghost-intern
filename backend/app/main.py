from fastapi import FastAPI
from fastapi.middleware.cors import (
    CORSMiddleware,
)

from app.api.routes import (
    analyze,
    ask,
)

app = FastAPI(
    title="Ghost Intern API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


app.include_router(analyze.router)
app.include_router(ask.router)


@app.get("/")
async def root():
    return {
        "message":
        "Ghost Intern backend running"
    }
