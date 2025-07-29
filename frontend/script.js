// const BASE_URL = "http://127.0.0.1:8000";  // FastAPI backend URL
// let userId = null;
// let currentQuestionId = null;

// // Fetch and display AI interviewer introduction
// async function getInterviewerIntro(userProfile) {
//     console.log("🔍 Calling getInterviewerIntro with profile:", userProfile);
//     try {
//         const res = await fetch(`${BASE_URL}/interview/intro`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(userProfile)
//         });
//         console.log("📡 Response status:", res.status);
//         const data = await res.json();
//         console.log("📄 Response data:", data);
        
//         if (data.interviewer_introduction) {
//             console.log("✅ Using interviewer_introduction");
//             document.getElementById("intro-container").innerText = data.interviewer_introduction;
//         } else if (data.intro) {
//             console.log("✅ Using intro fallback");
//             document.getElementById("intro-container").innerText = data.intro;
//         } else {
//             console.log("⚠️ Using default message");
//             document.getElementById("intro-container").innerText = "Welcome to your AI interview!";
//         }
//     } catch (err) {
//         console.error("❌ Error in getInterviewerIntro:", err);
//         document.getElementById("intro-container").innerText = "Welcome to your AI interview!";
//     }
// }

// // Register User
// // POST /users
// async function registerUser() {
//     const name = document.getElementById("name").value;
//     const email = document.getElementById("email").value;
//     const experience = document.getElementById("experience").value;
//     const position = document.getElementById("position").value;

//     const payload = { name, email, experience, position };

//     try {
//         // Calls POST /users
//         const res = await fetch(`${BASE_URL}/users`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload)
//         });
//         const data = await res.json();

//         if (res.status === 200 || res.status === 201) {
//             userId = data.id;
//             await getInterviewerIntro(payload);
//             document.getElementById("user-section").classList.add("hidden");
//             document.getElementById("candidate-intro-section").classList.remove("hidden");
//         } else {
//             console.error("Registration error:", res.status, data);
//             alert(data.detail || "Error registering user.");
//         }
//     } catch (err) {
//         console.error(err);
//         alert("Failed to register user.");
//     }
// }

// // Start Interview
// // POST /interview/{user_id}/start
// async function startInterview() {
//     try {
//         // Get the candidate profile if available
//         const candidateProfile = window.candidateProfile || null;
        
//         // Calls POST /interview/{user_id}/start
//         const res = await fetch(`${BASE_URL}/interview/${userId}/start`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ candidate_profile: candidateProfile })
//         });
//         const data = await res.json();

//         if (res.status === 200) {
//             currentQuestionId = data.question_id;
//             document.getElementById("question-container").innerText = data.first_question;
//         } else {
//             alert(data.detail || "Error starting interview.");
//         }
//     } catch (err) {
//         console.error(err);
//         alert("Failed to start interview.");
//     }
// }

// // Submit Answer
// // POST /interview/{user_id}/answer
// async function submitAnswer() {
//     const answer = document.getElementById("answer").value;
//     if (!answer.trim()) {
//         alert("Please enter your answer.");
//         return;
//     }

//     const payload = { question_id: currentQuestionId, user_answer: answer };

//     try {
//         // Calls POST /interview/{user_id}/answer
//         const res = await fetch(`${BASE_URL}/interview/${userId}/answer`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload)
//         });
//         const data = await res.json();

//         if (res.status === 200) {
//             document.getElementById("answer").value = "";
//             if (data.finished) {
//                 showResult();
//             } else {
//                 currentQuestionId += 1; // next question ID is sequential
//                 document.getElementById("question-container").innerText = data.next_question;
//             }
//         } else {
//             alert(data.detail || "Error submitting answer.");
//         }
//     } catch (err) {
//         console.error(err);
//         alert("Failed to submit answer.");
//     }
// }

// // Show Final Result
// // GET /interview/{user_id}/result
// async function showResult() {
//     document.getElementById("interview-section").classList.add("hidden");
//     document.getElementById("result-section").classList.remove("hidden");

//     try {
//         // Calls GET /interview/{user_id}/result
//         const res = await fetch(`${BASE_URL}/interview/${userId}/result`);
//         const data = await res.json();
//         if (res.status === 200) {
//             document.getElementById("result-output").innerHTML = `
//                 <p><strong>Score:</strong> ${data.overall_score}</p>
//                 <p><strong>Strengths:</strong> ${data.strengths.join(", ")}</p>
//                 <p><strong>Areas of Progress:</strong> ${data.areas_of_progress.join(", ")}</p>
//                 <p><strong>Feedback:</strong> ${data.feedback_summary}</p>
//             `;
//         } else {
//             alert(data.detail || "Error fetching result.");
//         }
//     } catch (err) {
//         console.error(err);
//         alert("Failed to fetch result.");
//     }
// }

// // Restart
// function restart() {
//     location.reload();
// }

// // Submit Candidate Introduction
// async function submitCandidateIntro() {
//     const candidateIntro = document.getElementById("candidate-intro").value;
//     if (!candidateIntro.trim()) {
//         alert("Please provide your introduction.");
//         return;
//     }

//     console.log("📝 Candidate introduction submitted:", candidateIntro);
    
//     try {
//         // Analyze the candidate's introduction
//         const res = await fetch(`${BASE_URL}/interview/analyze-intro`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ introduction: candidateIntro })
//         });
//         const profile = await res.json();
//         console.log("📊 Analyzed profile:", profile);
        
//         // Store the candidate introduction and profile for later use
//         window.candidateIntroduction = candidateIntro;
//         window.candidateProfile = profile;
        
//         // Hide intro section and show interview section
//         document.getElementById("candidate-intro-section").classList.add("hidden");
//         document.getElementById("intro-container").style.display = "none"; // Hide the AI intro
//         document.getElementById("interview-section").classList.remove("hidden");
        
//         // Start the technical interview
//         startInterview();
//     } catch (err) {
//         console.error("❌ Error analyzing introduction:", err);
//         alert("Failed to analyze introduction. Please try again.");
//     }
// }


// Configuration
const BASE_URL = "http://127.0.0.1:8000";

// Global variables
let userId = null;
let currentQuestionId = null;
let currentStep = 1;

// Media variables
let cameraStream = null;
let screenStream = null;
let recognition = null;
let isRecording = false;

// ========== UTILITY FUNCTIONS ==========

// Update progress and steps
function updateProgress(step) {
    currentStep = step;
    const progressPercent = (step - 1) * 33.33;
    document.getElementById('progress-fill').style.width = progressPercent + '%';
    
    for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        const lineEl = document.getElementById(`line-${i}`);
        
        if (i < step) {
            stepEl.className = 'step completed';
            if (lineEl) lineEl.className = 'step-line completed';
        } else if (i === step) {
            stepEl.className = 'step active';
        } else {
            stepEl.className = 'step';
            if (lineEl) lineEl.className = 'step-line';
        }
    }
}

// Show loading state
function showLoading(buttonElement) {
    const originalContent = buttonElement.innerHTML;
    buttonElement.innerHTML = '<span class="loading"></span>Processing...';
    buttonElement.disabled = true;
    return originalContent;
}

// Hide loading state
function hideLoading(buttonElement, originalContent) {
    buttonElement.innerHTML = originalContent;
    buttonElement.disabled = false;
}

// Show status message
function showStatus(elementId, message, isError = false) {
    const statusEl = document.getElementById(elementId);
    statusEl.innerHTML = `<div class="status-message ${isError ? 'status-error' : 'status-success'}">${message}</div>`;
    setTimeout(() => {
        statusEl.innerHTML = '';
    }, 3000);
}

// Smooth section transitions
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    setTimeout(() => {
        const targetSection = document.getElementById(sectionId);
        targetSection.classList.remove('hidden');
        targetSection.classList.add('animate-fade-in');
    }, 200);
}

// ========== INTERVIEW FUNCTIONS ==========

// Fetch and display AI interviewer introduction
async function getInterviewerIntro(userProfile) {
    console.log("🔍 Calling getInterviewerIntro with profile:", userProfile);
    try {
        const res = await fetch(`${BASE_URL}/interview/intro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userProfile)
        });
        console.log("📡 Response status:", res.status);
        const data = await res.json();
        console.log("📄 Response data:", data);
        
        const introContainer = document.getElementById("intro-container");
        if (data.interviewer_introduction) {
            console.log("✅ Using interviewer_introduction");
            introContainer.innerHTML = `<i class="fas fa-robot" style="color: #667eea; margin-right: 10px;"></i>${data.interviewer_introduction}`;
        } else if (data.intro) {
            console.log("✅ Using intro fallback");
            introContainer.innerHTML = `<i class="fas fa-robot" style="color: #667eea; margin-right: 10px;"></i>${data.intro}`;
        } else {
            console.log("⚠️ Using default message");
            introContainer.innerHTML = `<i class="fas fa-robot" style="color: #667eea; margin-right: 10px;"></i>Welcome to your AI Excel interview! I'm excited to assess your skills.`;
        }
        introContainer.classList.remove('hidden');
    } catch (err) {
        console.error("❌ Error in getInterviewerIntro:", err);
        const introContainer = document.getElementById("intro-container");
        introContainer.innerHTML = `<i class="fas fa-robot" style="color: #667eea; margin-right: 10px;"></i>Welcome to your AI Excel interview! I'm excited to assess your skills.`;
        introContainer.classList.remove('hidden');
    }
}

// Register User
async function registerUser() {
    const button = event.target;
    const originalContent = showLoading(button);
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const experience = document.getElementById("experience").value;
    const position = document.getElementById("position").value;

    if (!name || !email || !experience || !position) {
        alert("Please fill in all fields.");
        hideLoading(button, originalContent);
        return;
    }

    const payload = { name, email, experience, position };

    try {
        const res = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.status === 200 || res.status === 201) {
            userId = data.id;
            await getInterviewerIntro(payload);
            updateProgress(2);
            showSection('candidate-intro-section');
        } else {
            console.error("Registration error:", res.status, data);
            alert(data.detail || "Error registering user.");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to register user.");
    } finally {
        hideLoading(button, originalContent);
    }
}

// Submit Candidate Introduction
async function submitCandidateIntro() {
    const button = event.target;
    const originalContent = showLoading(button);
    
    const candidateIntro = document.getElementById("candidate-intro").value;
    if (!candidateIntro.trim()) {
        alert("Please provide your introduction.");
        hideLoading(button, originalContent);
        return;
    }

    console.log("📝 Candidate introduction submitted:", candidateIntro);
    
    try {
        const res = await fetch(`${BASE_URL}/interview/analyze-intro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ introduction: candidateIntro })
        });
        const profile = await res.json();
        console.log("📊 Analyzed profile:", profile);
        
        window.candidateIntroduction = candidateIntro;
        window.candidateProfile = profile;
        
        document.getElementById("intro-container").style.display = "none";
        updateProgress(3);
        showSection('interview-section');
        
        await startInterview();
    } catch (err) {
        console.error("❌ Error analyzing introduction:", err);
        alert("Failed to analyze introduction. Please try again.");
    } finally {
        hideLoading(button, originalContent);
    }
}

// Start Interview
async function startInterview() {
    try {
        const candidateProfile = window.candidateProfile || null;
        
        const res = await fetch(`${BASE_URL}/interview/${userId}/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ candidate_profile: candidateProfile })
        });
        const data = await res.json();

        if (res.status === 200) {
            currentQuestionId = data.question_id;
            document.getElementById("question-container").innerHTML = 
                `<i class="fas fa-question-circle" style="color: #f39c12; margin-right: 10px;"></i>${data.first_question}`;
        } else {
            alert(data.detail || "Error starting interview.");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to start interview.");
    }
}

// Submit Answer
async function submitAnswer() {
    const button = event.target;
    const originalContent = showLoading(button);
    
    const answer = document.getElementById("answer").value;
    if (!answer.trim()) {
        alert("Please enter your answer.");
        hideLoading(button, originalContent);
        return;
    }

    const payload = { question_id: currentQuestionId, user_answer: answer };

    try {
        const res = await fetch(`${BASE_URL}/interview/${userId}/answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.status === 200) {
            document.getElementById("answer").value = "";
            if (data.finished) {
                updateProgress(4);
                await showResult();
            } else {
                currentQuestionId += 1;
                document.getElementById("question-container").innerHTML = 
                    `<i class="fas fa-question-circle" style="color: #f39c12; margin-right: 10px;"></i>${data.next_question}`;
            }
        } else {
            alert(data.detail || "Error submitting answer.");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to submit answer.");
    } finally {
        hideLoading(button, originalContent);
    }
}

// Show Final Result
async function showResult() {
    showSection('result-section');

    try {
        const res = await fetch(`${BASE_URL}/interview/${userId}/result`);
        const data = await res.json();
        if (res.status === 200) {
            document.getElementById("result-output").innerHTML = `
                <div class="score-display">
                    <div class="score-circle">${data.overall_score}</div>
                    <h3>Overall Score</h3>
                </div>
                <div class="result-section">
                    <h3><i class="fas fa-star" style="color: #f39c12;"></i> Strengths</h3>
                    <p>${data.strengths.join(", ")}</p>
                </div>
                <div class="result-section">
                    <h3><i class="fas fa-chart-line" style="color: #3498db;"></i> Areas for Growth</h3>
                    <p>${data.areas_of_progress.join(", ")}</p>
                </div>
                <div class="result-section">
                    <h3><i class="fas fa-comments" style="color: #27ae60;"></i> Detailed Feedback</h3>
                    <p>${data.feedback_summary}</p>
                </div>
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

// CAMERA FUNCTIONS
async function startCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 300, height: 200 }, 
            audio: false 
        });
        document.getElementById('cameraFeed').srcObject = cameraStream;
        showStatus('media-status', 'Camera started successfully');
    } catch (err) {
        console.error('Camera error:', err);
        showStatus('media-status', 'Camera error: ' + err.message, true);
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        document.getElementById('cameraFeed').srcObject = null;
        cameraStream = null;
        showStatus('media-status', 'Camera stopped');
    }
}

// SCREEN SHARE FUNCTIONS
async function startScreenShare() {
    try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({ 
            video: { width: 300, height: 200 } 
        });
        document.getElementById('screenShare').srcObject = screenStream;
        showStatus('media-status', 'Screen sharing started');
        
        // Handle when user stops sharing via browser
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
            stopScreenShare();
        });
    } catch (err) {
        console.error('Screen share error:', err);
        showStatus('media-status', 'Screen share error: ' + err.message, true);
    }
}

function stopScreenShare() {
    if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
        document.getElementById('screenShare').srcObject = null;
        screenStream = null;
        showStatus('media-status', 'Screen sharing stopped');
    }
}

// SPEECH RECOGNITION FUNCTIONS
function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showStatus('speech-status', 'Speech recognition is not supported in your browser', true);
        return;
    }

    if (isRecording) {
        showStatus('speech-status', 'Already recording', true);
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    let finalTranscript = '';
    let interimTranscript = '';

    recognition.onstart = function() {
        isRecording = true;
        document.getElementById('recordingIndicator').classList.add('active');
        showStatus('speech-status', 'Recording started - speak now');
    };

    recognition.onresult = function(event) {
        interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        const answerBox = document.getElementById('answerBox');
        answerBox.value = finalTranscript + interimTranscript;
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        showStatus('speech-status', 'Recognition error: ' + event.error, true);
        stopRecording();
    };

    recognition.onend = function() {
        isRecording = false;
        document.getElementById('recordingIndicator').classList.remove('active');
        if (finalTranscript) {
            showStatus('speech-status', 'Recording completed successfully');
        }
    };

    try {
        recognition.start();
    } catch (err) {
        console.error('Failed to start recognition:', err);
        showStatus('speech-status', 'Failed to start recording', true);
        isRecording = false;
    }
}

function stopRecording() {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
        document.getElementById('recordingIndicator').classList.remove('active');
        showStatus('speech-status', 'Recording stopped');
    }
}

function clearAnswer() {
    document.getElementById('answerBox').value = '';
    showStatus('speech-status', 'Answer cleared - ready for editing');
}

function copyToMainAnswer() {
    const recordedAnswer = document.getElementById('answerBox').value;
    const mainAnswerField = document.getElementById('answer');
    
    if (recordedAnswer.trim()) {
        mainAnswerField.value = recordedAnswer;
        showStatus('speech-status', 'Answer copied to main answer field');
    } else {
        showStatus('speech-status', 'No text to copy', true);
    }
}

// Cleanup when page unloads
window.addEventListener('beforeunload', function() {
    stopCamera();
    stopScreenShare();
    stopRecording();
});


