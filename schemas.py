# app/schemas.py
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr


# ---------- User ----------
class UserBase(BaseModel):
    name: str
    email: EmailStr
    experience: Optional[str] = None
    position: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserOut(UserBase):
    id: int
    class Config:
        from_attributes = True


# ---------- Questions ----------
class QuestionCreate(BaseModel):
    question: str
    correct_answer: Optional[str] = None

class QuestionOut(BaseModel):
    id: int
    question: str
    user_answer: Optional[str]
    correct_answer: Optional[str]
    score: Optional[float]

    class Config:
        from_attributes = True


# ---------- Answer submission ----------
class AnswerIn(BaseModel):
    question_id: int
    user_answer: str

class GradedAnswerOut(BaseModel):
    question_id: int
    score: float
    rationale: str
    follow_up_needed: bool
    follow_up_question: Optional[str] = None
    finished: bool = False
    next_question: Optional[str] = None


# ---------- Result ----------
class InterviewResultCreate(BaseModel):
    overall_score: float
    strengths: Optional[List[str]] = None
    areas_of_progress: Optional[List[str]] = None
    feedback_summary: Optional[str] = None

class InterviewResultOut(BaseModel):
    id: int
    overall_score: float
    strengths: Optional[List[str]]
    areas_of_progress: Optional[List[str]]
    feedback_summary: Optional[str]

    class Config:
        from_attributes = True


# ---------- High-level flows ----------
class StartInterviewOut(BaseModel):
    first_question: str
    question_id: int
