# app/main.py
from fastapi import FastAPI
from database import Base, engine
from routers import users, interview

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-Powered Excel Mock Interviewer API")

app.include_router(users.router)
app.include_router(interview.router)
