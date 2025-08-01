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



const BASE_URL = "http://127.0.0.1:8000";
let userId = null;
let currentQuestionId = null;
let currentStep = 1;
let cameraStream = null;
let screenStream = null;
let recognition = null;
let isRecording = false;
let isCameraActive = false;
let isScreenShareActive = false;
let recordingTimer = null;
let recordingStartTime = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('[System] AI Excel Interview Initialized');
});

// Update progress and steps
function updateProgress(step) {
    console.log(`[Progress] Updating to step ${step}`);
    currentStep = step;
    const progressPercent = (step - 1) * 25;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }

    for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        const lineEl = document.getElementById(`line-${i}`);
        if (stepEl) {
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
}

// Check if both camera and screen share are active
function checkMediaStatus() {
    const proceedButton = document.getElementById('proceed-interview');
    const cameraBtn = document.getElementById('camera-btn');
    const screenBtn = document.getElementById('screen-btn');
    
    if (proceedButton) {
        proceedButton.disabled = !(isCameraActive && isScreenShareActive);
    }

    // Update button states
    if (isCameraActive && cameraBtn) {
        cameraBtn.innerHTML = '<i class="fas fa-check"></i> Camera Active';
        cameraBtn.disabled = true;
        cameraBtn.className = 'btn btn-success';
    }

    if (isScreenShareActive && screenBtn) {
        screenBtn.innerHTML = '<i class="fas fa-check"></i> Screen Share Active';
        screenBtn.disabled = true;
        screenBtn.className = 'btn btn-success';
    }

    if (isCameraActive && isScreenShareActive) {
        showStatus('media-status', 'Both camera and screen share are active! You can now proceed.', false);
    }
}

// Start camera
async function startCamera() {
    try {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }
        
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { 
                width: { ideal: 300 }, 
                height: { ideal: 200 },
                facingMode: 'user'
            },
            audio: false
        });
        
        const cameraFeed = document.getElementById('cameraFeed');
        if (cameraFeed) {
            cameraFeed.srcObject = cameraStream;
            isCameraActive = true;
            checkMediaStatus();
            console.log('[Camera] Started successfully');
        }
    } catch (err) {
        console.error('[Camera] Error:', err);
        isCameraActive = false;
        showStatus('media-status', `Camera access required: ${err.message}. Please allow camera access and try again.`, true);
    }
}

// Start screen share
async function startScreenShare() {
    try {
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
        }
        
        screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { 
                width: { ideal: 300 }, 
                height: { ideal: 200 }
            },
            audio: false
        });
        
        const screenShare = document.getElementById('screenShare');
        if (screenShare) {
            screenShare.srcObject = screenStream;
            isScreenShareActive = true;
            checkMediaStatus();
            console.log('[Screen Share] Started successfully');
            
            // Handle screen share ending
            screenStream.getVideoTracks().forEach(track => {
                track.addEventListener('ended', () => {
                    console.log('[Screen Share] Track ended');
                    isScreenShareActive = false;
                    const screenBtn = document.getElementById('screen-btn');
                    if (screenBtn) {
                        screenBtn.innerHTML = '<i class="fas fa-desktop"></i> Start Screen Share';
                        screenBtn.disabled = false;
                        screenBtn.className = 'btn btn-media';
                    }
                    checkMediaStatus();
                });
            });
        }
    } catch (err) {
        console.error('[Screen Share] Error:', err);
        isScreenShareActive = false;
        showStatus('media-status', `Screen sharing required: ${err.message}. Please share your screen to continue.`, true);
    }
}

// Proceed to Interview
async function proceedToInterview() {
    if (!isCameraActive || !isScreenShareActive) {
        showStatus('media-status', 'Both camera and screen share must be active to proceed!', true);
        return;
    }

    const button = event.target;
    const originalContent = showLoading(button);

    try {
        await getInterviewerIntro({
            name: document.getElementById("name")?.value.trim() || "Candidate",
            email: document.getElementById("email")?.value.trim() || "candidate@example.com",
            experience: document.getElementById("experience")?.value || "1-3",
            position: document.getElementById("position")?.value.trim() || "Analyst"
        });
        
        updateProgress(3);
        showSection('candidate-intro-section');
    } catch (err) {
        updateProgress(3);
        showSection('candidate-intro-section');
    } finally {
        hideLoading(button, originalContent);
    }
}

// Fetch and display AI interviewer introduction
async function getInterviewerIntro(userProfile) {
    try {
        const res = await fetch(`${BASE_URL}/interview/intro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userProfile),
            signal: AbortSignal.timeout(10000)
        });
        
        const data = await res.json();
        const introContainer = document.getElementById("intro-container");
        
        if (introContainer) {
            const introText = data.interviewer_introduction || data.intro || 
                `Hello ${userProfile.name}! Welcome to your Excel skills assessment. I'm your AI interviewer and I'll be evaluating your Excel knowledge through a series of practical questions. Let's begin with your introduction.`;
            
            introContainer.innerHTML = `<i class="fas fa-robot" style="color: #667eea; margin-right: 10px;"></i>${introText}`;
        }
    } catch (err) {
        const introContainer = document.getElementById("intro-container");
        if (introContainer) {
            introContainer.innerHTML = `<i class="fas fa-robot" style="color: #667eea; margin-right: 10px;"></i>Welcome to your Excel skills assessment! Please introduce yourself.`;
        }
    }
}

// Submit Candidate Introduction
async function submitCandidateIntro() {
    const button = event.target;
    const originalContent = showLoading(button);

    const candidateIntro = document.getElementById("candidate-intro").value.trim();
    if (!candidateIntro) {
        showStatus('intro-status', 'Please provide your introduction.', true);
        hideLoading(button, originalContent);
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/interview/analyze-intro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ introduction: candidateIntro }),
            signal: AbortSignal.timeout(10000)
        });
        
        if (res.ok) {
            const profile = await res.json();
            window.candidateProfile = profile;
        }
        
        window.candidateIntroduction = candidateIntro;
        updateProgress(4);
        showSection('interview-section');
        await startInterview();
    } catch (err) {
        window.candidateIntroduction = candidateIntro;
        updateProgress(4);
        showSection('interview-section');
        await startInterview();
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
            body: JSON.stringify({ candidate_profile: candidateProfile }),
            signal: AbortSignal.timeout(10000)
        });

        if (res.ok) {
            const data = await res.json();
            currentQuestionId = data.question_id || 1;
            const questionContainer = document.getElementById("question-container");
            if (questionContainer) {
                questionContainer.innerHTML = `<i class="fas fa-question-circle" style="color: #f39c12; margin-right: 10px;"></i>${data.first_question || data.question}`;
            }
        } else {
            throw new Error('Failed to start interview');
        }
    } catch (err) {
        // Fallback with demo question
        currentQuestionId = 1;
        const questionContainer = document.getElementById("question-container");
        if (questionContainer) {
            questionContainer.innerHTML = `<i class="fas fa-question-circle" style="color: #f39c12; margin-right: 10px;"></i>Can you explain the difference between VLOOKUP and INDEX-MATCH functions in Excel? When would you use each one?`;
        }
    }
}

// Update recording status message
function updateRecordingStatus(message, isError = false) {
    const statusElement = document.querySelector('.recording-status p');
    if (statusElement) {
        statusElement.innerHTML = `<i class="fas fa-${isError ? 'exclamation-triangle' : 'info-circle'}"></i> ${message}`;
        statusElement.style.color = isError ? '#dc3545' : '#856404';
    }
}

// Start recording
function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        updateRecordingStatus('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.', true);
        return;
    }

    if (isRecording) {
        updateRecordingStatus('Already recording', true);
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    let finalTranscript = '';
    recordingStartTime = Date.now();

    recognition.onstart = function() {
        isRecording = true;
        
        // Update UI
        document.getElementById('recordingIndicator').classList.add('active');
        document.getElementById('recording-timer').style.display = 'block';
        document.getElementById('start-record-btn').disabled = true;
        document.getElementById('stop-record-btn').disabled = false;
        
        // Start timer
        startRecordingTimer();
        
        updateRecordingStatus('🎤 Recording in progress - speak clearly into your microphone');
        console.log('[Voice Recording] Started');
    };

    recognition.onresult = function(event) {
        let interimTranscript = '';
        finalTranscript = '';
        
        for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        const answerField = document.getElementById('answer');
        if (answerField) {
            answerField.value = finalTranscript + interimTranscript;
        }
    };

    recognition.onerror = function(event) {
        console.error('[Speech Recognition] Error:', event.error);
        updateRecordingStatus(`Recording error: ${event.error}. Please try again.`, true);
        stopRecording();
    };

    recognition.onend = function() {
        if (isRecording) {
            stopRecording();
        }
    };

    try {
        recognition.start();
    } catch (err) {
        console.error('[Speech Recognition] Start error:', err);
        updateRecordingStatus('Failed to start recording: ' + err.message, true);
        isRecording = false;
    }
}

// Start recording timer
function startRecordingTimer() {
    const timerDisplay = document.getElementById('timer-display');
    recordingTimer = setInterval(() => {
        if (recordingStartTime && timerDisplay) {
            const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// Stop recording
function stopRecording() {
    if (recognition && isRecording) {
        recognition.stop();
    }
    
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
    
    isRecording = false;
    
    // Update UI
    document.getElementById('recordingIndicator').classList.remove('active');
    document.getElementById('recording-timer').style.display = 'none';
    document.getElementById('start-record-btn').disabled = false;
    document.getElementById('stop-record-btn').disabled = true;
    
    const answerField = document.getElementById('answer');
    if (answerField && answerField.value.trim().length > 10) {
        updateRecordingStatus('✅ Recording completed successfully! You can edit your answer or submit it.');
    } else {
        updateRecordingStatus('❌ No sufficient speech detected. Please try recording again and speak clearly.', true);
    }
}

// Clear answer
function clearAnswer() {
    const answerField = document.getElementById('answer');
    if (answerField) {
        answerField.value = '';
    }
    updateRecordingStatus('Answer cleared. You can type your answer or record using voice.');
}

// Submit Answer
async function submitAnswer() {
    const button = event.target;
    const originalContent = showLoading(button);

    const answer = document.getElementById("answer").value.trim();
    
    if (!answer) {
        updateRecordingStatus('Please provide an answer before submitting', true);
        hideLoading(button, originalContent);
        return;
    }

    if (answer.length < 20) {
        updateRecordingStatus('Your answer seems too short. Please provide a more detailed response.', true);
        hideLoading(button, originalContent);
        return;
    }

    const payload = { question_id: currentQuestionId, user_answer: answer };
    
    try {
        const res = await fetch(`${BASE_URL}/interview/${userId}/answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10000)
        });

        if (res.ok) {
            const data = await res.json();
            
            if (data.finished) {
                await showResult();
            } else {
                // Move to next question
                currentQuestionId = data.question_id || (currentQuestionId + 1);
                const questionContainer = document.getElementById("question-container");
                if (questionContainer) {
                    questionContainer.innerHTML = `<i class="fas fa-question-circle" style="color: #f39c12; margin-right: 10px;"></i>${data.next_question || data.question}`;
                }
                // Clear answer field for next question
                document.getElementById('answer').value = '';
                updateRecordingStatus('Answer submitted successfully! Please answer the next question.');
            }
        } else {
            throw new Error('Failed to submit answer');
        }
    } catch (err) {
        // Fallback for demo - simulate moving to next question or ending
        if (currentQuestionId >= 3) {
            await showResult();
        } else {
            // Move to next demo question
            currentQuestionId++;
            const demoQuestions = [
                "How would you create a dynamic chart in Excel that updates automatically when new data is added?",
                "Explain how you would use PivotTables to analyze sales data across different regions and time periods.",
                "Describe the process of creating and using Excel macros to automate repetitive tasks."
            ];
            
            const questionContainer = document.getElementById("question-container");
            if (questionContainer && demoQuestions[currentQuestionId - 2]) {
                questionContainer.innerHTML = `<i class="fas fa-question-circle" style="color: #f39c12; margin-right: 10px;"></i>${demoQuestions[currentQuestionId - 2]}`;
            }
            // Clear answer field for next question
            document.getElementById('answer').value = '';
            updateRecordingStatus('Answer submitted successfully! Please answer the next question.');
        }
    } finally {
        hideLoading(button, originalContent);
    }
}

// Show final results
async function showResult() {
    showSection('result-section');
    
    try {
        const res = await fetch(`${BASE_URL}/interview/${userId}/result`, {
            method: "GET",
            signal: AbortSignal.timeout(10000)
        });

        if (res.ok) {
            const result = await res.json();
            displayResult(result);
        } else {
            throw new Error('Failed to get results');
        }
    } catch (err) {
        // Fallback demo result
        const demoResult = {
            overall_score: Math.floor(Math.random() * 30) + 70, // 70-100
            technical_score: Math.floor(Math.random() * 25) + 75,
            communication_score: Math.floor(Math.random() * 20) + 80,
            detailed_feedback: "You demonstrated good understanding of Excel functions and showed clear communication skills.",
            recommendations: "Consider practicing more advanced functions like INDEX-MATCH and exploring Power Query features."
        };
        displayResult(demoResult);
    }
}

// Display results
function displayResult(result) {
    const resultOutput = document.getElementById('result-output');
    if (resultOutput) {
        resultOutput.innerHTML = `
            <div class="score-display">
                <div class="score-circle">${result.overall_score || '85'}%</div>
                <h3>Interview Completed</h3>
            </div>
            <div class="result-section">
                <h3>📊 Performance Summary</h3>
                <p><strong>Technical Score:</strong> ${result.technical_score || '82'}%</p>
                <p><strong>Communication Score:</strong> ${result.communication_score || '88'}%</p>
                <p><strong>Overall Score:</strong> ${result.overall_score || '85'}%</p>
            </div>
            <div class="result-section">
                <h3>📝 Detailed Feedback</h3>
                <p>${result.detailed_feedback || 'You demonstrated good Excel knowledge and clear communication skills.'}</p>
            </div>
            <div class="result-section">
                <h3>🎯 Recommendations</h3>
                <p>${result.recommendations || 'Continue practicing advanced Excel features and maintain clear communication skills.'}</p>
            </div>
        `;
    }
    
    console.log('[Interview] Completed successfully');
}

// Restart interview
function restart() {
    // Stop all media streams
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
        screenStream = null;
    }

    // Reset all variables
    userId = null;
    currentQuestionId = null;
    currentStep = 1;
    recognition = null;
    isRecording = false;
    isCameraActive = false;
    isScreenShareActive = false;
    recordingTimer = null;
    recordingStartTime = null;

    // Clear all form fields
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.value = '';
    });

    // Reset progress and show first section
    updateProgress(1);
    showSection('user-section');
    
    console.log('[System] Interview reset completed');
}


// Show loading state
function showLoading(buttonElement) {
    if (!buttonElement) return "";
    const originalContent = buttonElement.innerHTML;
    buttonElement.innerHTML = '<span class="loading"></span>Processing...';
    buttonElement.disabled = true;
    return originalContent;
}

// Hide loading state
function hideLoading(buttonElement, originalContent) {
    if (buttonElement) {
        buttonElement.innerHTML = originalContent;
        buttonElement.disabled = false;
    }
}

// Show status message
function showStatus(elementId, message, isError = false) {
    const statusEl = document.getElementById(elementId);
    if (statusEl) {
        statusEl.innerHTML = `<div class="status-message ${isError ? 'status-error' : 'status-success'}">${message}</div>`;
        setTimeout(() => {
            statusEl.innerHTML = '';
        }, 5000);
    }
}

// Smooth section transitions
function showSection(sectionId) {
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.classList.add('hidden');
    });

    setTimeout(() => {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('animate-fade-in');
        }
    }, 200);
}

// Register User
async function registerUser() {
    const button = event.target;
    const originalContent = showLoading(button);

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const experience = document.getElementById("experience").value;
    const position = document.getElementById("position").value.trim();

    if (!name || !email || !experience || !position) {
        showStatus('registration-status', 'Please fill in all fields', true);
        hideLoading(button, originalContent);
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showStatus('registration-status', 'Please enter a valid email address', true);
        hideLoading(button, originalContent);
        return;
    }

    const payload = { name, email, experience, position };

    try {
        const res = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10000)
        });

        const data = await res.json();

        if (res.ok) {
            userId = data.id || `user-${Date.now()}`;
            updateProgress(2);
            showSection('media-activation-section');
            showStatus('media-status', 'Registration successful! Please enable camera and screen share.');
        } else {
            showStatus('registration-status', data.detail || 'Registration failed. Please try again.', true);
        }
    } catch (err) {
        showStatus('registration-status', 'Registration failed. Please try again.', true);
    } finally {
        hideLoading(button, originalContent);
    }
}