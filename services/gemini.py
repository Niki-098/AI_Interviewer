# app/services/gemini.py
import os
import json
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

import google.generativeai as genai

# GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-1.5-pro")
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_API_KEY = 'AIzaSyDH1PaZnZyad0oHlXhP7b4_Gj-5s2qJ2gQ'
GEMINI_MODEL_NAME = 'gemini-1.5-flash'

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    raise RuntimeError("Set GEMINI_API_KEY env var.")

_model = genai.GenerativeModel(GEMINI_MODEL_NAME)


# ---- Prompt templates ----

QUESTION_GEN_SYSTEM = """
You are an Excel technical interviewer. Generate one next question ONLY.
Return STRICT JSON with fields:
{
  "question": "<string>",
  "ideal_answer": "<string>",
  "category": "<Formulas|Pivot Tables|Power Query|Charts|Shortcuts|Data Cleaning|VBA|Modeling>",
  "difficulty": "<EASY|MEDIUM|HARD>"
}
Rules:
- Consider candidate's years of experience and position.
- Consider the transcript so far (asked questions, scores).
- Gradually increase/decrease difficulty.
- Ask only one question.
- The question should be self-contained.
- Do not add markdown fences or any prose outside of the JSON.
"""

GRADER_SYSTEM = """
You are a strict Excel answer grader. 
Given the question, the candidate answer, and the ideal answer, output STRICT JSON:
{
  "score": 0-100 (number),
  "rationale": "one or two crisp sentences explaining the score",
  "follow_up_needed": true/false,
  "follow_up_question": "<string or null>"
}
Be objective, short, and specific.
"""

SUMMARY_SYSTEM = """
You are a coach. Turn the per-question scores and rationales into a final structured result.
Output STRICT JSON:
{
  "overall_score": <0-100>,
  "strengths": ["..."],
  "areas_of_progress": ["..."],
  "feedback_summary": "<short paragraph>"
}
"""

def _ensure_json(content: str) -> Dict[str, Any]:
    content = content.strip()
    if content.startswith("```"):
        # Remove the first line (```json or ```)
        content = "\n".join(content.splitlines()[1:])
        # Remove the last line if it's ```
        if content.endswith("```"):
            content = "\n".join(content.splitlines()[:-1])
    return json.loads(content)

def generate_next_question(user_profile: Dict[str, Any],
                           history: List[Dict[str, Any]]) -> Dict[str, Any]:
    prompt = (
        f"{QUESTION_GEN_SYSTEM}\n"
        f"Candidate profile: {json.dumps(user_profile)}\n"
        f"History: {json.dumps(history)}"
    )
    resp = _model.generate_content(prompt)
    print("Gemini raw response:", repr(resp.text))  # Add this line for debugging
    try:
        return _ensure_json(resp.text)
    except Exception as e:
        print("Gemini JSON decode error:", e)
        print("Gemini response text:", repr(resp.text))
        raise RuntimeError("Gemini API did not return valid JSON. See server logs for details.")

def grade_answer(question: str, ideal_answer: str, user_answer: str) -> Dict[str, Any]:
    prompt = (
        f"{GRADER_SYSTEM}\n"
        f"Question: {json.dumps(question)}\n"
        f"Ideal Answer: {json.dumps(ideal_answer)}\n"
        f"Candidate Answer: {json.dumps(user_answer)}"
    )
    resp = _model.generate_content(prompt)
    return _ensure_json(resp.text)

def summarize_results(per_question: List[Dict[str, Any]]) -> Dict[str, Any]:
    prompt = f"{SUMMARY_SYSTEM}\nPer-question data: {json.dumps(per_question)}"
    resp = _model.generate_content(prompt)
    return _ensure_json(resp.text)
