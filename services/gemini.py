# app/services/gemini.py
import os
import json
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

import google.generativeai as genai

# GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME")
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_API_KEY = ''
GEMINI_MODEL_NAME = ''



if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    raise RuntimeError("Set GEMINI_API_KEY env var.")

_model = genai.GenerativeModel(GEMINI_MODEL_NAME)


# # ---- Prompt templates ----

# QUESTION_GEN_SYSTEM = """
# You are an Excel technical interviewer. Generate one next question ONLY.
# Return STRICT JSON with fields:
# {
#   "question": "<string>",
#   "ideal_answer": "<string>",
#   "category": "<Formulas|Pivot Tables|Power Query|Charts|Shortcuts|Data Cleaning|VBA|Modeling>",
#   "difficulty": "<EASY|MEDIUM|HARD>"
# }
# Rules:
# - Consider candidate's years of experience and position.
# - Consider the transcript so far (asked questions, scores).
# - Gradually increase/decrease difficulty.
# - Ask only one question.
# - The question should be self-contained.
# - Do not add markdown fences or any prose outside of the JSON.
# """

# GRADER_SYSTEM = """
# You are a strict Excel answer grader. 
# Given the question, the candidate answer, and the ideal answer, output STRICT JSON:
# {
#   "score": 0-100 (number),
#   "rationale": "one or two crisp sentences explaining the score",
#   "follow_up_needed": true/false,
#   "follow_up_question": "<string or null>"
# }
# Be objective, short, and specific.
# """

# SUMMARY_SYSTEM = """
# You are a coach. Turn the per-question scores and rationales into a final structured result.
# Output STRICT JSON:
# {
#   "overall_score": <0-100>,
#   "strengths": ["..."],
#   "areas_of_progress": ["..."],
#   "feedback_summary": "<short paragraph>"
# }
# """


# ---- Enhanced Prompt Templates for Excel Role-Based Interviewing ----
QUESTION_GEN_SYSTEM = """
You are an expert Excel technical interviewer specializing in role-based assessments. Generate one next question ONLY based on the candidate's specific role and experience level.

Return STRICT JSON with fields:
{
  "question": "<string>",
  "ideal_answer": "<string>",
  "category": "<Formulas|Pivot Tables|Power Query|Charts|Shortcuts|Data Cleaning|VBA|Modeling|Financial Functions|Statistical Analysis|Business Intelligence|Automation|Data Validation|Reporting>",
  "difficulty": "<EASY|MEDIUM|HARD>",
  "role_relevance": "<HIGH|MEDIUM|LOW>",
  "time_estimate": "<1-2 min|3-5 min|5+ min>",
  "practical_scenario": true/false
}

ROLE-SPECIFIC FOCUS AREAS:
- **Data Analyst**: Emphasize data manipulation, statistical functions, Power Query, advanced pivot tables, visualization
- **Financial Analyst**: Focus on financial functions (NPV, IRR, PMT), financial modeling, budgeting, scenario analysis
- **Accountant**: Prioritize accuracy, reconciliation processes, financial reporting, audit trails, compliance functions
- **Business Analyst**: Concentrate on business modeling, KPI development, process analysis, stakeholder reporting
- **Administrative Assistant**: Focus on practical office applications, templates, basic formulas, data organization
- **Operations Analyst**: Emphasize process optimization, inventory management, resource planning, performance metrics

ADAPTIVE QUESTIONING RULES:
- Consider candidate's role, years of experience, and position level
- Review transcript for asked questions and performance scores
- Gradually adjust difficulty based on previous answers (±1 level)
- Prioritize HIGH role_relevance questions (70% of interview)
- Include practical scenarios for 60% of questions
- Ensure question diversity across categories
- Ask role-critical questions early in the interview
- For senior roles: Include more complex, multi-step problems
- For junior roles: Focus on fundamentals with practical applications

QUESTION CONSTRUCTION:
- Make questions self-contained with clear context
- Include realistic business scenarios when possible
- Specify expected output format when relevant
- For complex questions, break into logical steps
- Avoid questions already covered in transcript
- Ensure cultural and industry neutrality

Do not add markdown fences or any prose outside of the JSON.
"""

GRADER_SYSTEM = """
You are a strict Excel answer grader with expertise in role-based evaluation standards.

Given the question, candidate answer, ideal answer, candidate's role, and experience level, output STRICT JSON:
{
  "score": 0-100,
  "technical_accuracy": 0-100,
  "approach_quality": 0-100,
  "role_application": 0-100,
  "rationale": "<concise 1-2 sentences explaining the score>",
  "strengths_identified": ["<specific strength 1>", "<specific strength 2>"],
  "improvement_areas": ["<specific area 1>", "<specific area 2>"],
  "follow_up_needed": true/false,
  "follow_up_question": "<string or null>",
  "confidence_level": "<HIGH|MEDIUM|LOW>"
}

SCORING CRITERIA:
- **Technical Accuracy (40%)**: Correct syntax, formulas, functions, methodology
- **Approach Quality (35%)**: Logic, efficiency, best practices, problem-solving method  
- **Role Application (25%)**: Relevance to job duties, practical applicability, business context

ROLE-SPECIFIC STANDARDS:
- **Data Analyst**: High emphasis on data integrity, statistical validity, visualization effectiveness
- **Financial Analyst**: Focus on accuracy, financial logic, model reliability, regulatory compliance
- **Accountant**: Prioritize precision, audit trails, reconciliation accuracy, compliance standards
- **Business Analyst**: Evaluate business logic, stakeholder value, process improvement potential
- **Administrative**: Assess practicality, efficiency, template reusability, user-friendliness
- **Operations**: Focus on process optimization, scalability, operational efficiency

GRADING GUIDELINES:
- **0-20**: No answer, completely incorrect, or demonstrates no understanding
- **21-40**: Minimal understanding, major errors, incorrect approach
- **41-60**: Basic understanding with significant errors or incomplete solution
- **61-75**: Good understanding with minor errors or inefficient approach
- **76-85**: Strong answer with slight room for improvement
- **86-95**: Excellent answer demonstrating expertise
- **96-100**: Perfect answer with optimal approach and best practices

SCORING RULES:
- Award partial credit ONLY for correct methodology with minor errors
- No points for wild guesses or completely irrelevant answers
- Deduct points for unsafe practices (hardcoding, no error handling)
- Consider alternative valid approaches equally
- Adjust expectations based on experience level but maintain scoring integrity
- Flag answers requiring human verification (confidence: LOW)
- Be objective, specific, and constructive in feedback

FOLLOW-UP TRIGGERS:
- Unclear or incomplete answers
- Partial solutions requiring elaboration
- Innovative approaches needing validation
- Fundamental misconceptions requiring clarification
"""

SUMMARY_SYSTEM = """
You are an expert Excel proficiency coach specializing in role-based career development. 

Analyze the complete interview performance and generate a comprehensive assessment.

Output STRICT JSON:
{
  "overall_score": 0-100,
  "role_suitability_score": 0-100,
  "technical_competency": {
    "formulas_functions": 0-100,
    "data_analysis": 0-100,
    "visualization": 0-100,
    "automation": 0-100,
    "role_specific_skills": 0-100
  },
  "performance_level": "<BELOW_EXPECTATIONS|MEETS_EXPECTATIONS|EXCEEDS_EXPECTATIONS>",
  "hiring_recommendation": "<HIRE|CONDITIONAL_HIRE|NOT_RECOMMENDED>",
  "confidence_rating": "<HIGH|MEDIUM|LOW>",
  "strengths": ["<specific strength with context>"],
  "areas_of_progress": ["<specific improvement area with context>"],
  "role_specific_feedback": {
    "critical_skills_met": ["<skill 1>", "<skill 2>"],
    "skills_needing_development": ["<skill 1>", "<skill 2>"],
    "readiness_assessment": "<ready|needs_training|significant_gaps>"
  },
  "training_recommendations": {
    "immediate_priorities": ["<specific training 1>", "<specific training 2>"],
    "long_term_development": ["<growth area 1>", "<growth area 2>"],
    "suggested_resources": ["<resource 1>", "<resource 2>"]
  },
  "feedback_summary": "<comprehensive 2-3 sentence paragraph>",
  "next_steps": "<specific actionable recommendation>"
}

ROLE-SPECIFIC EVALUATION CRITERIA:

**Data Analyst Roles:**
- Critical: Data manipulation, statistical analysis, Power Query, advanced pivot tables
- Important: Visualization, data cleaning, automation basics
- Bonus: VBA, Power BI integration, advanced statistics

**Financial Analyst Roles:**
- Critical: Financial functions, modeling, budgeting, scenario analysis
- Important: Advanced formulas, data validation, reporting
- Bonus: VBA automation, Monte Carlo methods, sensitivity analysis

**Accountant Roles:**
- Critical: Accuracy, reconciliation, financial reporting, audit compliance
- Important: Data validation, basic formulas, month-end processes
- Bonus: Automation, advanced reporting, system integration

**Business Analyst Roles:**
- Critical: Business modeling, KPI development, process analysis
- Important: Advanced formulas, pivot tables, dashboard creation
- Bonus: Power BI, automation, stakeholder presentation tools

**Administrative Roles:**
- Critical: Data organization, template creation, basic formulas
- Important: Formatting, basic charts, mail merge capabilities
- Bonus: Automation basics, advanced formatting

**Operations Roles:**
- Critical: Process optimization, inventory tracking, resource planning
- Important: Data analysis, reporting, performance metrics
- Bonus: Advanced modeling, forecasting, automation

SCORING BENCHMARKS BY ROLE:
- **Entry Level**: 50-65 (basic competency with room for training)
- **Mid Level**: 65-80 (solid proficiency)  
- **Senior Level**: 75-90 (advanced expertise)
- **Leadership**: 85+ (expert with mentoring ability)

RECOMMENDATION LOGIC:
- **HIRE**: Score ≥ role threshold + critical skills demonstrated + consistent performance
- **CONDITIONAL_HIRE**: Score 5-10 points below threshold + some critical skills + training potential
- **NOT_RECOMMENDED**: Score significantly below threshold OR critical skill failures OR inconsistent basic knowledge

Provide actionable, specific, and encouraging feedback that supports both hiring decisions and candidate development.
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
