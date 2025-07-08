import { checkAuthState, checkSaldoMensagens, saveSimuladoResult } from './authValidation_simp.js';

// Elementos do DOM
const generateButton = document.querySelector(".generate-button");
const questionsContainer = document.querySelector(".questions-container");
const questionCountInput = document.getElementById("questionCount");
const timerDurationInput = document.getElementById("timerDuration");
const timerDisplay = document.getElementById("time");
const controlTimerButton = document.getElementById("controlTimer");
const subjectSelect = document.getElementById("subjectSelect");
const messageContainer = document.getElementById('messageContainer') || document.createElement('div');
messageContainer.id = 'messageContainer';
document.body.appendChild(messageContainer);

// Variáveis de estado
let selectedSubject = "";
let timer;
let seconds = 0;
let timerRunning = false;
let currentUserId = null;
let currentQuestions = [];

// Configuração inicial
document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    try {
        showLoading("Verifying authentication...");
        
        currentUserId = await checkAuthState();
        if (!currentUserId) {
            throw new Error("User not authenticated");
        }
        
        const hasSaldo = await checkSaldoMensagens(currentUserId);
        if (!hasSaldo) {
            disableGenerateButton("Insufficient message balance");
        }
        
        setupEventListeners();
        setupSubjectSelect();
        hideLoading();
    } catch (error) {
        console.error('Initialization error:', error);
        showError("Please login to access this feature", () => {
            window.location.href = '/index.html';
        });
    }
}

function setupEventListeners() {
    subjectSelect.addEventListener("change", () => {
        selectedSubject = subjectSelect.value;
    });

    generateButton.addEventListener("click", handleGenerateClick);
    
    controlTimerButton.addEventListener("click", handleTimerControl);
}

function setupSubjectSelect() {
    const subjects = [
        "ABAP Basics",
        "ABAP Objects",
        "ABAP Dictionary",
        "ABAP Reports",
        "ABAP Dialog Programming",
        "ABAP Performance",
        "ABAP Web Dynpro",
        "ABAP OData Services"
    ];
    
    subjects.forEach(subject => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });
}

async function handleGenerateClick() {
    try {
        currentUserId = await checkAuthState();
        if (!currentUserId) {
            throw new Error("Session expired");
        }

        if (!selectedSubject) {
            throw new Error("Please select a subject first");
        }
        
        const questionCount = parseInt(questionCountInput.value);
        if (isNaN(questionCount) || questionCount < 5 || questionCount > 30) {
            throw new Error("Please choose between 5 and 30 questions");
        }
        
        await generateExercises(questionCount);
        startTimer();
        controlTimerButton.textContent = "Pause";
    } catch (error) {
        console.error("Generation error:", error);
        showError(error.message);
    }
}

function handleTimerControl() {
    switch (controlTimerButton.textContent) {
        case "Start":
            startTimer();
            controlTimerButton.textContent = "Pause";
            break;
        case "Pause":
            pauseTimer();
            controlTimerButton.textContent = "Continue";
            break;
        case "Continue":
            resumeTimer();
            controlTimerButton.textContent = "Pause";
            break;
    }
}

// Timer Functions
function startTimer() {
    if (!timerRunning) {
        clearInterval(timer);
        seconds = parseInt(timerDurationInput.value) * 60 || 0;
        timer = setInterval(updateTimer, 1000);
        timerRunning = true;
    }
}

function pauseTimer() {
    clearInterval(timer);
    timerRunning = false;
}

function resumeTimer() {
    if (!timerRunning) {
        timer = setInterval(updateTimer, 1000);
        timerRunning = true;
    }
}

function updateTimer() {
    if (seconds > 0) {
        seconds--;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    } else {
        clearInterval(timer);
        timerRunning = false;
        showMessage("Time's up!", 'info');
        controlTimerButton.textContent = "Start";
        autoSubmitAnswers();
    }
}

// Exercise Generation
async function generateExercises(questionCount) {
    try {
        questionsContainer.innerHTML = "<div class='loading'>Generating questions...</div>";
        
        const hasSaldo = await checkSaldoMensagens(currentUserId);
        if (!hasSaldo) {
            throw new Error("Insufficient message balance");
        }
        
        currentQuestions = await generateQuestionsWithOpenAI(questionCount, selectedSubject);
        displayQuestions(currentQuestions);
    } catch (error) {
        console.error("Exercise generation failed:", error);
        questionsContainer.innerHTML = `<p class="error">${error.message}</p>`;
        throw error;
    }
}

async function generateQuestionsWithOpenAI(count, subject) {
    const apiKey = "your-api-key-should-be-on-backend"; // Mover para backend em produção
    const prompt = `Generate ${count} multiple-choice questions about ${subject} in ABAP programming.
Each question should have:
1. A clear question statement
2. 5 alternatives (A, B, C, D, E)
3. The correct answer marked with "Correct Answer: X" (where X is the letter)

Format example:
1. What is the purpose of the ABAP DATA statement?
A) To declare variables
B) To perform calculations
C) To create database tables
D) To define screen elements
E) To call functions
Correct Answer: A`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return parseQuestionsFromResponse(data.choices[0].message.content);
    } catch (error) {
        console.error("OpenAI API error:", error);
        throw new Error("Failed to generate questions. Please try again later.");
    }
}

function parseQuestionsFromResponse(content) {
    const questions = [];
    const questionBlocks = content.split(/\n\d+\./).filter(block => block.trim().length > 0);

    questionBlocks.forEach((block, index) => {
        const lines = block.split('\n').filter(line => line.trim().length > 0);
        const statement = lines[0].trim();
        const alternatives = {};
        let correctAnswer = "";

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.match(/correct answer:\s*[a-e]/i)) {
                correctAnswer = line.split(':')[1].trim().toUpperCase();
            } else if (line.match(/^[A-E]\)/)) {
                const letter = line[0];
                const text = line.substring(2).trim();
                alternatives[letter] = text;
            }
        }

        if (statement && Object.keys(alternatives).length === 5 && correctAnswer) {
            questions.push({
                statement,
                alternatives,
                correctAnswer
            });
        }
    });

    return questions;
}

// Display and Submission
function displayQuestions(questions) {
    questionsContainer.innerHTML = "";
    
    questions.forEach((question, index) => {
        const questionElement = document.createElement("div");
        questionElement.className = "question";
        questionElement.dataset.questionIndex = index;
        questionElement.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${question.statement}</p>
            <ul class="options">
                ${Object.entries(question.alternatives).map(([letter, text]) => `
                    <li class="option">
                        <label>
                            <input type="radio" name="question${index}" value="${letter}">
                            ${letter}) ${text}
                        </label>
                    </li>
                `).join("")}
            </ul>
        `;
        questionsContainer.appendChild(questionElement);
    });

    const submitButton = document.createElement("button");
    submitButton.className = "submit-button";
    submitButton.textContent = "Submit Answers";
    submitButton.addEventListener("click", handleSubmit);
    questionsContainer.appendChild(submitButton);
}

async function handleSubmit() {
    try {
        showLoading("Processing your answers...");
        
        const results = checkAnswers(currentQuestions);
        await saveResults(results);
        
        showResults(results);
        hideLoading();
    } catch (error) {
        console.error("Submission error:", error);
        showError("Failed to submit answers");
        hideLoading();
    }
}

function autoSubmitAnswers() {
    if (document.querySelector('.submit-button')) {
        handleSubmit();
    }
}

function checkAnswers(questions) {
    const results = {
        score: 0,
        total: questions.length,
        details: [],
        timeSpent: timerDisplay.textContent
    };

    questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        const userAnswer = selectedOption ? selectedOption.value : null;
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) results.score++;
        
        results.details.push({
            question: question.statement,
            userAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect
        });

        // Highlight correct answer
        const questionElement = document.querySelector(`.question[data-question-index="${index}"]`);
        if (questionElement) {
            const correctOption = questionElement.querySelector(`input[value="${question.correctAnswer}"]`);
            if (correctOption) {
                correctOption.parentElement.classList.add('correct-answer');
            }
            
            if (selectedOption && !isCorrect) {
                selectedOption.parentElement.classList.add('incorrect-answer');
            }
        }
    });

    return results;
}

async function saveResults(results) {
    try {
        await saveSimuladoResult(
            currentUserId,
            selectedSubject,
            results.details.map(detail => ({
                statement: detail.question,
                userAnswer: detail.userAnswer || "Not answered",
                correctAnswer: detail.correctAnswer,
                isCorrect: detail.isCorrect
            })),
            results.score,
            results.total - results.score
        );
    } catch (error) {
        console.error("Failed to save results:", error);
        throw new Error("Could not save your results. Please try again.");
    }
}

function showResults(results) {
    clearInterval(timer);
    timerRunning = false;
    
    const resultElement = document.createElement("div");
    resultElement.className = "result-summary";
    resultElement.innerHTML = `
        <h3>Test Completed</h3>
        <p>Score: ${results.score} out of ${results.total}</p>
        <p>Percentage: ${Math.round((results.score / results.total) * 100)}%</p>
        <p>Time: ${results.timeSpent}</p>
        <div class="detailed-results"></div>
    `;
    
    const detailedResults = resultElement.querySelector('.detailed-results');
    results.details.forEach((detail, index) => {
        const detailElement = document.createElement('div');
        detailElement.className = `question-result ${detail.isCorrect ? 'correct' : 'incorrect'}`;
        detailElement.innerHTML = `
            <h4>Question ${index + 1}: ${detail.isCorrect ? '✓' : '✗'}</h4>
            <p>${detail.question}</p>
            <p>Your answer: ${detail.userAnswer || "Not answered"}</p>
            <p>Correct answer: ${detail.correctAnswer}</p>
        `;
        detailedResults.appendChild(detailElement);
    });
    
    questionsContainer.appendChild(resultElement);
    document.querySelector('.submit-button')?.remove();
    
    // Disable all inputs
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.disabled = true;
    });
}

// UI Helpers
function showLoading(message) {
    const loading = document.createElement('div');
    loading.className = 'loading-indicator';
    loading.textContent = message;
    loading.id = 'loadingIndicator';
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) loading.remove();
}

function showMessage(message, type = 'info') {
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    
    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

function showError(message, callback) {
    showMessage(message, 'error');
    if (callback) setTimeout(callback, 3000);
}

function disableGenerateButton(reason) {
    generateButton.disabled = true;
    generateButton.title = reason;
}

// Styles
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .loading-indicator {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
        }
        
        .message {
            padding: 10px 15px;
            margin: 10px 0;
            border-radius: 4px;
        }
        
        .message-error {
            background-color: #ffebee;
            color: #c62828;
            border: 1px solid #ef9a9a;
        }
        
        .message-info {
            background-color: #e3f2fd;
            color: #1565c0;
            border: 1px solid #90caf9;
        }
        
        .message-success {
            background-color: #e8f5e9;
            color: #2e7d32;
            border: 1px solid #a5d6a7;
        }
        
        .question {
            margin-bottom: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 5px;
        }
        
        .options {
            list-style: none;
            padding: 0;
        }
        
        .option {
            margin: 5px 0;
            padding: 5px;
            border-radius: 3px;
        }
        
        .option:hover {
            background: #e0e0e0;
        }
        
        .correct-answer {
            background-color: #e8f5e9 !important;
            font-weight: bold;
        }
        
        .incorrect-answer {
            background-color: #ffebee !important;
            text-decoration: line-through;
        }
        
        .submit-button {
            margin-top: 20px;
            padding: 10px 20px;
            background: #2196f3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        
        .submit-button:hover {
            background: #0d8bf2;
        }
        
        .submit-button:disabled {
            background: #b0bec5;
            cursor: not-allowed;
        }
        
        .result-summary {
            margin-top: 20px;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 5px;
        }
        
        .question-result {
            margin: 10px 0;
            padding: 10px;
            border-radius: 4px;
        }
        
        .question-result.correct {
            background-color: #e8f5e9;
            border-left: 4px solid #2e7d32;
        }
        
        .question-result.incorrect {
            background-color: #ffebee;
            border-left: 4px solid #c62828;
        }
        
        select, input {
            padding: 8px;
            margin: 5px 0;
            border-radius: 4px;
            border: 1px solid #bdbdbd;
        }
        
        button {
            transition: background-color 0.3s;
        }
    `;
    document.head.appendChild(style);
}

// Initialize styles
addStyles();