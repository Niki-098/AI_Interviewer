**1. Overview**

The AI-Powered Excel Mock Interviewer is a web application designed to simulate a professional Excel skills assessment. It leverages FastAPI for the backend, SQLAlchemy for database management, and a frontend built with HTML/CSS/JS to deliver an interactive user experience. The system integrates with Google Gemini for generating and grading interview questions, storing user profiles, questions, answers, and results in a PostgreSQL database.
2. System Architecture
2.1 Backend

Framework: FastAPI for RESTful API development.
Database: PostgreSQL with SQLAlchemy ORM for data persistence.
Dependencies:

fastapi, uvicorn: API server and ASGI implementation.
SQLAlchemy, alembic: ORM and database migrations.
google-generativeai: For question generation and answer grading.
psycopg2: PostgreSQL driver.
pydantic: Data validation and serialization.
black, isort: Code formatting and organization.


Structure:

database.py: Configures SQLAlchemy engine and session.
deps.py: Dependency injection for database sessions.
models.py: Defines User, InterviewQuestion, and InterviewResult tables.
schemas.py: Pydantic models for request/response validation.
main.py: Main application, CORS setup, static file serving, and router inclusion.
users.py: Handles user creation and retrieval.
interview.py: Manages interview flow, question generation, and answer grading.



2.2 Frontend

Technology: Static HTML/CSS/JS served via FastAPI's StaticFiles.
Structure:

index.html: Single-page application with sections for user details, media setup, introduction, interview questions, and results.
Features camera and screen-sharing setup, voice/text answer submission, and result display.



2.3 Database Schema

Users: Stores user details (id, name, email, experience, position, created_at).
Interview Questions: Stores questions, user answers, correct answers, scores, and user references (user_id foreign key).
Interview Results: Stores overall scores, strengths, areas of progress, feedback, and user references (user_id foreign key).

3. Approach Strategy
3.1 Development Approach

Modular Design: Separate concerns into routers (users, interview), models, schemas, and services for maintainability.
ORM Usage: SQLAlchemy for database operations, ensuring scalability and type safety.
API-First: RESTful endpoints for user management, interview flow, and result retrieval.
Dependency Injection: Use FastAPI's Depends for database session management.
AI Integration: Leverage Google Gemini for dynamic question generation and answer grading based on user profiles.
CORS: Enable cross-origin requests for frontend-backend communication during development.

3.2 Workflow

User Registration: Users submit details (name, email, experience, position) via /users endpoint.
Interview Initialization: Start interview via /interview/{user_id}/start, generating the first question based on user profile.
Question and Answer Flow:

Questions fetched or generated dynamically using interview_engine.
Users submit answers (text/voice) via /interview/{user_id}/answer.
Answers graded by Gemini, stored with scores and rationale.
Follow-up questions or interview termination based on interview_engine logic.


Result Generation: Finalize interview via /interview/{user_id}/finalize, storing overall scores, strengths, and feedback.
Frontend Interaction: Users navigate through HTML sections for input, media setup, and answer submission, with results displayed post-interview.

3.3 Technical Considerations

Scalability: FastAPI and PostgreSQL ensure high-performance API and data handling.
Error Handling: HTTP exceptions for invalid users, questions, or duplicate submissions.
Data Validation: Pydantic models enforce strict input/output schemas.
Media Integration: Browser-based camera and screen-sharing APIs for interview realism.
AI Robustness: Gemini integration for adaptive question generation and consistent grading.
