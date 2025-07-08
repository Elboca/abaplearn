
import {
    checkAuthState,
    checkSaldoMensagens,
} from './authValidation_simp.js';// Elementos do DOM
const generateButton = document.querySelector(".generate-button");
const questionsContainer = document.querySelector(".questions-container");
const questionCountInput = document.getElementById("questionCount");
const timerDurationInput = document.getElementById("timerDuration");
const timerDisplay = document.getElementById("time");
const controlTimerButton = document.getElementById("controlTimer");
const subjectSelect = document.getElementById("subjectSelect");
const messageContainer = document.getElementById('messageContainer');

// Variáveis de estado
let selectedSubject = "";
let timer;
let seconds = 0;
let timerRunning = false;
let currentQuestions = [];

// Chave da API - EM PRODUÇÃO MOVER PARA BACKEND!
const apiKey = "sk-svcacct-rCZJ4KlGZ1OVeWDVXCjKcX8zkZ7FcYwGd4ooDZ6m1WIrc2M3IgGJj6urQEQhMJT3BlbkFJeP4BeVA70sjes2-6AlD3qthVL69vdrjSSQ-oexFAy0sfebFHexHQ59hMSgxJQA";

// Configuração inicial
document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    try {
        displayMessage("Checking authentication...", 'info');
        
        // Verificação de autenticação
        const isAuthenticated = await checkAuthState();
        if (!isAuthenticated) {
            throw new Error("User not authenticated");
        }
        
        setupSubjectSelect();
        setupEventListeners();
        
        displayMessage("Ready to start. Select a subject!", 'success');
    } catch (error) {
        console.error('Initialization error:', error);
      //  displayMessage("Authentication failed. Redirecting to login...", 'error');
    //    setTimeout(() => {
    //        window.location.href = '/index.html';
  //      }, 3000);
  //  }
}

function setupEventListeners() {
    subjectSelect.addEventListener("change", (e) => {
        selectedSubject = e.target.value;
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
        if (!selectedSubject) {
            displayMessage("Please select a subject first", 'error');
            return;
        }
        
        const questionCount = parseInt(questionCountInput.value);
        if (isNaN(questionCount)) {
            displayMessage("Invalid number of questions", 'error');
            return;
        }
        
        if (questionCount < 5 || questionCount > 30) {
            displayMessage("Please choose between 5 and 30 questions", 'error');
            return;
        }
        
        // Verificar saldo de mensagens
        const hasSaldo = await checkSaldoMensagens();
        if (!hasSaldo) {
            throw new Error("Insufficient message balance");
        }
        
        await generateExercises(questionCount);
        
        startTimer();
        controlTimerButton.textContent = "Pause";
        
    } catch (error) {
        console.error("Generate error:", error);
        displayMessage(error.message || "Error generating exercises", 'error');
    }
}

function handleTimerControl() {
    if (!timerRunning && controlTimerButton.textContent === "Start") {
        startTimer();
        controlTimerButton.textContent = "Pause";
    } else if (timerRunning && controlTimerButton.textContent === "Pause") {
        pauseTimer();
        controlTimerButton.textContent = "Continue";
    } else if (!timerRunning && controlTimerButton.textContent === "Continue") {
        resumeTimer();
        controlTimerButton.textContent = "Pause";
    }
}

// Funções do Timer
function startTimer() {
    if (timerRunning) return;
    
    clearInterval(timer);
    seconds = parseInt(timerDurationInput.value) * 60 || 1800;
    timerRunning = true;
    
    updateTimerDisplay();
    
    timer = setInterval(() => {
        seconds--;
        updateTimerDisplay();
        
        if (seconds <= 0) {
            clearInterval(timer);
            timerRunning = false;
            displayMessage("Time's up!", 'info');
            controlTimerButton.textContent = "Start";
            handleSubmit();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    timerRunning = false;
}

function resumeTimer() {
    if (timerRunning) return;
    startTimer();
}

function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Geração de Exercícios com OpenAI
async function generateExercises(questionCount) {
    try {
        questionsContainer.innerHTML = "<div class='loading'>Generating questions... Please wait</div>";
        
        const prompt = `Generate ${questionCount} multiple-choice questions about ${selectedSubject} in ABAP programming.
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
            const errorData = await response.json();
            throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        currentQuestions = parseQuestionsFromResponse(data.choices[0].message.content);
        displayQuestions(currentQuestions);
        
    } catch (error) {
        console.error("Exercise generation failed:", error);
        questionsContainer.innerHTML = `<p class="error">${error.message || "Failed to generate questions"}</p>`;
        throw error;
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

// Exibição de Questões
function displayQuestions(questions) {
    questionsContainer.innerHTML = "";
    
    questions.forEach((question, index) => {
        const questionElement = document.createElement("div");
        questionElement.className = "question";
        questionElement.dataset.index = index;
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

// Submissão de Respostas
async function handleSubmit() {
    try {
        // Parar timer
        clearInterval(timer);
        timerRunning = false;
        
        if (currentQuestions.length === 0) {
            displayMessage("No questions to submit", 'error');
            return;
        }
        
        // Verificar respostas
        const results = checkAnswers();
        
        // Salvar resultados
        await saveSimuladoResult(results);
        
        // Mostrar resultados
        showResults(results);
        
    } catch (error) {
        console.error("Submission error:", error);
        displayMessage("Error submitting answers", 'error');
    }
}

function checkAnswers() {
    const results = {
        score: 0,
        total: currentQuestions.length,
        details: [],
        timeSpent: timerDisplay.textContent
    };

    currentQuestions.forEach((question, index) => {
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

        // Destacar respostas
        const questionElement = document.querySelector(`.question[data-index="${index}"]`);
        if (questionElement) {
            // Destacar resposta correta
            const correctOption = questionElement.querySelector(`input[value="${question.correctAnswer}"]`);
            if (correctOption) {
                correctOption.parentElement.parentElement.classList.add('correct-answer');
            }
            
            // Destacar resposta incorreta do usuário
            if (selectedOption && !isCorrect) {
                selectedOption.parentElement.parentElement.classList.add('incorrect-answer');
            }
        }
    });

    return results;
}

function showResults(results) {
    const resultElement = document.createElement("div");
    resultElement.className = "result-summary";
    resultElement.innerHTML = `
        <h3>Test Results</h3>
        <p>Subject: ${selectedSubject}</p>
        <p>Score: <strong>${results.score}/${results.total}</strong> (${Math.round((results.score/results.total)*100)}%)</p>
        <p>Time Spent: ${results.timeSpent}</p>
    `;
    
    questionsContainer.appendChild(resultElement);
    
    // Remover botão de submissão
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) submitButton.remove();
    
    // Desabilitar todas as opções
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.disabled = true;
    });
}

// Função de exibição de mensagens
function displayMessage(message, type = 'info') {
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    
    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Funções de autenticação (implementação de exemplo)
async function checkAuthState() {
    // Implementação real deve verificar o estado de autenticação
    return new Promise(resolve => {
        setTimeout(() => {
            // Simular usuário autenticado
            resolve(true);
        }, 1000);
    });
}

async function checkSaldoMensagens() {
    // Implementação real deve verificar o saldo de mensagens
    return new Promise(resolve => {
        setTimeout(() => {
            // Simular saldo suficiente
            resolve(true);
        }, 500);
    });
}

async function saveSimuladoResult(results) {
    // Implementação real deve salvar os resultados
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Results saved:", results);
            resolve(true);
        }, 1000);
    });
}

// Estilos embutidos
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
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
            background: #f9f9f9;
            border-radius: 5px;
            border-left: 4px solid #2196f3;
        }
        .options {
            list-style: none;
            padding: 0;
        }
        .options li {
            margin: 8px 0;
            padding: 8px;
            background: #fff;
            border-radius: 4px;
        }
        .submit-button {
            display: block;
            margin: 20px auto;
            padding: 12px 25px;
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
        .result-summary {
            margin-top: 20px;
            padding: 20px;
            background: #e8f5e9;
            border-radius: 5px;
            text-align: center;
        }
        .loading {
            text-align: center;
            padding: 20px;
            font-style: italic;
            color: #666;
        }
        .error {
            color: #c62828;
            text-align: center;
            padding: 20px;
        }
        .correct-answer {
            background-color: #e8f5e9 !important;
            border-left: 3px solid #2e7d32;
        }
        .incorrect-answer {
            background-color: #ffebee;
            border-left: 3px solid #c62828;
        }
    `;
    document.head.appendChild(style);
}

// Inicializar estilos
addStyles();
