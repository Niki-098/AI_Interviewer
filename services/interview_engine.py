# app/services/interview_engine.py
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from models import *
from services import gemini

FINISH_AFTER_QUESTIONS = 8  # tweak as you like
MIN_TARGET_SCORE = 80

def build_user_profile(user: User) -> Dict[str, Any]:
    return {
        "name": user.name,
        "experience": user.experience,
        "position": user.position
    }

def build_history(user: User) -> List[Dict[str, Any]]:
    hist = []
    for q in user.interview_questions:
        hist.append({
            "question_id": q.id,
            "question": q.question,
            "user_answer": q.user_answer,
            "score": q.score,
        })
    return hist

def interview_finished(user: User) -> bool:
    # If a result already exists, the interview is done.
    return user.interview_result is not None

def should_finish(user: User) -> bool:
    qs = user.interview_questions
    if len(qs) >= FINISH_AFTER_QUESTIONS:
        return True
    # stop early if they're consistently very high/low, etc. customize here
    return False

def create_next_question(db: Session, user: User) -> InterviewQuestion:
    profile = build_user_profile(user)
    history = build_history(user)
    q_json = gemini.generate_next_question(profile, history)
    # Persist the question with ideal answer in DB (as correct_answer)
    iq = InterviewQuestion(
        user_id=user.id,
        question=q_json["question"],
        correct_answer=q_json.get("ideal_answer")
    )
    db.add(iq)
    db.commit()
    db.refresh(iq)
    return iq

def grade_and_store(db: Session,
                    q: InterviewQuestion,
                    user_answer: str) -> Dict[str, Any]:
    graded = gemini.grade_answer(q.question, q.correct_answer or "", user_answer)
    q.user_answer = user_answer
    q.score = float(graded["score"])
    db.add(q)
    db.commit()
    db.refresh(q)
    return graded

def finalize_and_store_result(db: Session, user: User) -> InterviewResult:
    per_q = []
    for q in user.interview_questions:
        per_q.append({
            "question_id": q.id,
            "question": q.question,
            "score": q.score or 0,
            "rationale": "",  # if you want to store rationales, store them in another column
        })

    summary = gemini.summarize_results(per_q)
    res = InterviewResult(
        user_id=user.id,
        overall_score=summary["overall_score"],
        strengths=summary.get("strengths"),
        areas_of_progress=summary.get("areas_of_progress"),
        feedback_summary=summary.get("feedback_summary")
    )
    db.add(res)
    db.commit()
    db.refresh(res)
    return res
