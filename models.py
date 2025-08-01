from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base  # Base = declarative_base()

# 1. User Table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    experience = Column(String(50), nullable=True)
    position = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    interview_questions = relationship("InterviewQuestion", back_populates="user", cascade="all, delete")
    interview_result = relationship("InterviewResult", back_populates="user", uselist=False, cascade="all, delete")


# 2. Interview Question Table
class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    user_answer = Column(Text, nullable=True)
    correct_answer = Column(Text, nullable=True)
    score = Column(Float, nullable=True)  
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="interview_questions")


# 3. Interview Result Table
class InterviewResult(Base):
    __tablename__ = "interview_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    overall_score = Column(Float, nullable=False)
    strengths = Column(JSON, nullable=True)         
    areas_of_progress = Column(JSON, nullable=True) 
    feedback_summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="interview_result")
