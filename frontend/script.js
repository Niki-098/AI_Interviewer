const BASE_URL = "http://127.0.0.1:8000";  // FastAPI backend URL
let userId = null;
let currentQuestionId = null;

// Register User
// POST /users
async function registerUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const experience = document.getElementById("experience").value;
    const position = document.getElementById("position").value;

    const payload = { name, email, experience, position };

    try {
        // Calls POST /users
        const res = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.status === 200 || res.status === 201) {
            userId = data.id;
            document.getElementById("user-section").classList.add("hidden");
            document.getElementById("interview-section").classList.remove("hidden");
            startInterview();
        } else {
            console.error("Registration error:", res.status, data);
            alert(data.detail || "Error registering user.");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to register user.");
    }
}

// Start Interview
// POST /interview/{user_id}/start
async function startInterview() {
    try {
        // Calls POST /interview/{user_id}/start
        const res = await fetch(`${BASE_URL}/interview/${userId}/start`, {
            method: "POST"
        });
        const data = await res.json();

        if (res.status === 200) {
            currentQuestionId = data.question_id;
            document.getElementById("question-container").innerText = data.first_question;
        } else {
            alert(data.detail || "Error starting interview.");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to start interview.");
    }
}

// Submit Answer
// POST /interview/{user_id}/answer
async function submitAnswer() {
    const answer = document.getElementById("answer").value;
    if (!answer.trim()) {
        alert("Please enter your answer.");
        return;
    }

    const payload = { question_id: currentQuestionId, user_answer: answer };

    try {
        // Calls POST /interview/{user_id}/answer
        const res = await fetch(`${BASE_URL}/interview/${userId}/answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.status === 200) {
            document.getElementById("answer").value = "";
            if (data.finished) {
                showResult();
            } else {
                currentQuestionId += 1; // next question ID is sequential
                document.getElementById("question-container").innerText = data.next_question;
            }
        } else {
            alert(data.detail || "Error submitting answer.");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to submit answer.");
    }
}

// Show Final Result
// GET /interview/{user_id}/result
async function showResult() {
    document.getElementById("interview-section").classList.add("hidden");
    document.getElementById("result-section").classList.remove("hidden");

    try {
        // Calls GET /interview/{user_id}/result
        const res = await fetch(`${BASE_URL}/interview/${userId}/result`);
        const data = await res.json();
        if (res.status === 200) {
            document.getElementById("result-output").innerHTML = `
                <p><strong>Score:</strong> ${data.overall_score}</p>
                <p><strong>Strengths:</strong> ${data.strengths.join(", ")}</p>
                <p><strong>Areas of Progress:</strong> ${data.areas_of_progress.join(", ")}</p>
                <p><strong>Feedback:</strong> ${data.feedback_summary}</p>
            `;
        } else {
            alert(data.detail || "Error fetching result.");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to fetch result.");
    }
}

// Restart
function restart() {
    location.reload();
}
