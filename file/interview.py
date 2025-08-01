from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

import models
import schemas
from deps import get_db
from services import interview_engine
from services.gemini import generate_interview_intro, analyze_candidate_profile

router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/{user_id}/store-profile")
def store_candidate_profile(user_id: int, candidate_profile: dict, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Store the profile in the user model (you might want to add a profile column)
    # For now, we'll store it in a session or cache
    return {"status": "profile_stored"}

@router.post("/{user_id}/start", response_model=schemas.StartInterviewOut)
def start_interview(user_id: int, candidate_profile: Optional[dict] = None, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if interview_engine.interview_finished(user):
        raise HTTPException(status_code=400, detail="Interview already finished for this user")

    # If there are already questions, assume interview already started
    if user.interview_questions:
        q = user.interview_questions[-1]
        return schemas.StartInterviewOut(first_question=q.question, question_id=q.id)

    q = interview_engine.create_next_question(db, user, candidate_profile)
    return schemas.StartInterviewOut(first_question=q.question, question_id=q.id)


@router.post("/{user_id}/answer", response_model=schemas.GradedAnswerOut)
def submit_answer(user_id: int, payload: schemas.AnswerIn, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if interview_engine.interview_finished(user):
        raise HTTPException(status_code=400, detail="Interview already finished for this user")

    q = db.get(models.InterviewQuestion, payload.question_id)
    if not q or q.user_id != user.id:
        raise HTTPException(status_code=404, detail="Question not found for this user")

    if q.user_answer is not None:
        raise HTTPException(status_code=400, detail="Answer already submitted for this question")

    graded = interview_engine.grade_and_store(db, q, payload.user_answer)

    # Decide next step
    if interview_engine.should_finish(user):
        # finalize and stop
        result = interview_engine.finalize_and_store_result(db, user)
        return schemas.GradedAnswerOut(
            question_id=q.id,
            score=float(graded["score"]),
            rationale=graded["rationale"],
            follow_up_needed=graded["follow_up_needed"],
            follow_up_question=graded.get("follow_up_question"),
            finished=True,
            next_question=None
        )

    # otherwise continue
    next_q = interview_engine.create_next_question(db, user)
    return schemas.GradedAnswerOut(
        question_id=q.id,
        score=float(graded["score"]),
        rationale=graded["rationale"],
        follow_up_needed=graded["follow_up_needed"],
        follow_up_question=graded.get("follow_up_question"),
        finished=False,
        next_question=next_q.question
    )


@router.get("/{user_id}/questions", response_model=list[schemas.QuestionOut])
def list_questions(user_id: int, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.interview_questions


@router.post("/{user_id}/finalize", response_model=schemas.InterviewResultOut)
def finalize(user_id: int, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.interview_result:
        return user.interview_result

    if not user.interview_questions:
        raise HTTPException(status_code=400, detail="No questions answered")

    result = interview_engine.finalize_and_store_result(db, user)
    return result


@router.get("/{user_id}/result", response_model=schemas.InterviewResultOut)
def get_result(user_id: int, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.interview_result:
        raise HTTPException(status_code=404, detail="Result not found (interview not finalized yet)")
    return user.interview_result


@router.post("/intro")
def interview_intro(user_profile: dict):
    return generate_interview_intro(user_profile)


@router.post("/analyze-intro")
def analyze_intro(candidate_intro: dict):
    return analyze_candidate_profile(candidate_intro.get("introduction", ""))
