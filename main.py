from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import Base, engine
from file import users, interview

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-Powered Excel Mock Interviewer API")

# Enable CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files from the frontend directory at /static
app.mount("/static", StaticFiles(directory="frontend", html=True), name="static")

from fastapi.responses import FileResponse

@app.get("/")
def read_index():
    return FileResponse("frontend/index.html")

app.include_router(users.router)
app.include_router(interview.router)
