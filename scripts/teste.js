import {
    checkAuthState,
    checkSaldoMensagens
} from './authValidation_simp.js';

// ATENÇÃO: Nunca exponha sua apiKey no frontend em produção!
const apiKey = process.env.OPENAI_API_KEY; // Troque por backend seguro em produção.

const generateButton = document.querySelector(".generate-button");
const questionsContainer = document.querySelector(".questions-container");
const questionCountInput = document.getElementById("questionCount");
const timerDurationInput = document.getElementById("timerDuration");
const timerDisplay = document.getElementById("time");
const controlTimerButton = document.getElementById("controlTimer");
const subjectSelect = document.getElementById("subjectSelect");

let selectedSubject = "";
let timer;
let seconds = 0;
let timerRunning = false;

// Event listeners
subjectSelect.addEventListener("change", () => {
    selectedSubject = subjectSelect.value;
});

generateButton.addEventListener("click", () => {
    if (!selectedSubject) {
        displayMessage("Please, select a test before generating exercises", 'error');
        return;
    }
    const questionCount = parseInt(questionCountInput.value, 10);
    if (isNaN(questionCount) || questionCount < 5 || questionCount > 30) {
        displayMessage("Please choose a number of questions between 5 and 30.", 'error');
        return;
    }
    generateExercises(questionCount);
    startTimer();
    controlTimerButton.textContent = "Pause";
});

controlTimerButton.addEventListener("click", () => {
    if (controlTimerButton.textContent === "Start") {
        startTimer();
        controlTimerButton.textContent = "Pause";
    } else if (controlTimerButton.textContent === "Pause") {
        pauseTimer();
        controlTimerButton.textContent = "Continue";
    } else if (controlTimerButton.textContent === "Continue") {
        resumeTimer();
        controlTimerButton.textContent = "Pause";
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await checkAuthState();
    } catch (error) {
        window.location.href = '/index.html';
    }
});

function startTimer() {
    clearInterval(timer);
    seconds = parseInt(timerDurationInput.value, 10) * 60;
    if (isNaN(seconds) || seconds <= 0) seconds = 60 * 5; // fallback para 5 minutos
    timer = setInterval(updateTimer, 1000);
    timerRunning = true;
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
        displayMessage("Time's up!", 'info');
        controlTimerButton.textContent = "Start";
    }
}

Seu código continuará dando erro se tentar acessar a variável de ambiente OPENAI_API_KEY diretamente no arquivo scripts/teste.js, pois variáveis de ambiente só existem no backend ou em funções serverless (como as do Netlify).
Elas nunca ficam disponíveis no JavaScript do navegador em um site estático.
O que você deve fazer:
1. Frontend (teste.js):

    Nunca tente acessar process.env.OPENAI_API_KEY nem nada parecido.
    Em vez disso, envie seu prompt para uma função serverless (Netlify Function).

2. Netlify Function (backend):

    Acesse process.env.OPENAI_API_KEY apenas aqui.
    Essa função recebe o prompt do frontend, faz a chamada à OpenAI, e devolve o resultado ao frontend.

Exemplo de fluxo correto
A. Netlify Function (netlify/functions/openai-proxy.js):
js

const fetch = require('node-fetch');

exports.handler = async function(event) {
  const { prompt } = JSON.parse(event.body || '{}');
  const apiKey = process.env.OPENAI_API_KEY;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.5
    }),
  });

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

    Dica: O node-fetch geralmente já está disponível no ambiente Netlify Functions. Se não estiver, adicione no package.json do seu projeto.

B. Frontend (scripts/teste.js):
js

async function gerarQuestoes(prompt) {
  const response = await fetch('/.netlify/functions/openai-proxy', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ prompt })
  });
  const data = await response.json();
  return data;
}
async function generateExercises(questionCount) {
    questionsContainer.innerHTML = "<p>Generating exercises, please wait...</p>";

    try {
        const userId = await checkAuthState();
        const hasSaldoMensagens = await checkSaldoMensagens(userId);

        if (!hasSaldoMensagens) {
            displayMessage("You don't have enough message balance to proceed.", 'error');
            return;
        }
        const assistantId = 'asst_qKw62JCa2JMEW9hi4e6cyi5t';
        const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{
                    role: "user",
                    content: `Generate ${questionCount} multiple-choice questions about ${selectedSubject} in ABAP programming. Each question should have a statement and 5 alternatives (A, B, C, D, E). Indicate the correct answer for each question in the format 'Answer: X', where X is the letter of the correct alternative. Also, provide a short explanation for each question in the format 'Comment: ...'. Do not give greetings, just provide the questions.`
                }],
                max_tokens: 4000,
                temperature: 0.5,
            })
        });

        if (!response.ok) {
            throw new Error("Failed to generate exercises");
        }

        const data = await response.json();
        const questions = parseQuestionsFromResponse(data.choices[0]?.message?.content || "");
        displayQuestions(questions);
    } catch (error) {
        questionsContainer.innerHTML = "<p>An error occurred while generating the exercises. Please try again.</p>";
        displayMessage("Error generating exercises. Please try again later.", 'error');
    }
}

// Agora o parser reconhece "Comment:" ou "Explanation:"
function parseQuestionsFromResponse(content) {
    const questions = [];
    const questionBlocks = content.split(/\d+\.\s/).filter(Boolean);

    questionBlocks.forEach((block) => {
        const lines = block.split("\n").filter(Boolean);
        const statement = lines[0]?.trim() || "";
        const alternatives = {};
        let correctAnswer = "";
        let comment = "";

        lines.slice(1).forEach((line) => {
            if (
                line.toLowerCase().startsWith("answer:") ||
                line.toLowerCase().startsWith("correct answer:")
            ) {
                correctAnswer = line.split(":")[1]?.trim() || "";
            } else if (
                line.toLowerCase().startsWith("comment:") ||
                line.toLowerCase().startsWith("explanation:")
            ) {
                comment = line.split(":").slice(1).join(":").trim();
            } else {
                const [letter, text] = line.split(") ");
                if (letter && text) {
                    alternatives[letter.trim()] = text.trim();
                }
            }
        });

        questions.push({
            statement,
            alternatives,
            correctAnswer,
            comment // Inclui o comentário!
        });
    });

    return questions;
}

function displayQuestions(questions) {
    questionsContainer.innerHTML = "";
    questions.forEach((question, index) => {
        const questionElement = document.createElement("div");
        questionElement.classList.add("question");
        questionElement.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${question.statement}</p>
            <ul class="options">
                ${Object.entries(question.alternatives)
                    .map(
                        ([letter, text]) => `
                    <li class="option">
                        <label>
                            <input type="radio" name="question${index}" value="${letter}">
                            ${letter}) ${text}
                        </label>
                    </li>
                `
                    )
                    .join("")}
            </ul>
        `;
        questionsContainer.appendChild(questionElement);
    });

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit Answers";
    submitButton.classList.add("submit-button");
    submitButton.addEventListener("click", async () => {
        const { score, wrongAnswers } = checkAnswers(questions);
        clearInterval(timer);
        timerRunning = false;
        await processSubmission(selectedSubject, questions, score, wrongAnswers);
    });
    questionsContainer.appendChild(submitButton);
}

// Exibe comentário após certo/errado
function checkAnswers(questions) {
    let score = 0;
    let wrongAnswers = 0;

    document.querySelectorAll('.correct-answer, .incorrect-answer').forEach(e => e.remove());
    const oldSummary = document.querySelector('.result-summary');
    if (oldSummary) oldSummary.remove();

    questions.forEach((question, index) => {
        const questionElement = questionsContainer.querySelectorAll('.question')[index];
        const selectedAnswer = questionElement.querySelector(`input[name="question${index}"]:checked`);
        const correctAnswer = question.correctAnswer;
        const comment = question.comment || "";

        const resultElement = document.createElement("div");
        resultElement.style.marginTop = "10px";

        if (selectedAnswer) {
            if (selectedAnswer.value === correctAnswer) {
                score++;
                resultElement.innerHTML = `<p class="correct-answer">Correct! The answer is ${correctAnswer}.</p>`;
            } else {
                resultElement.innerHTML = `<p class="incorrect-answer">Incorrect! The answer is ${correctAnswer}.</p>`;
                wrongAnswers++;
            }
        } else {
            resultElement.innerHTML = `<p class="incorrect-answer">Not answered. The correct answer is ${correctAnswer}.</p>`;
            wrongAnswers++;
        }
        // Adiciona comentário/explicação da questão
        if (comment) {
            const commentElement = document.createElement("p");
            commentElement.classList.add("question-comment");
            commentElement.textContent = `Explanation: ${comment}`;
            resultElement.appendChild(commentElement);
        }
        questionElement.appendChild(resultElement);
    });

    const totalTime = timerDisplay.textContent;
    const resultSummary = document.createElement("div");
    resultSummary.classList.add("result-summary");
    resultSummary.innerHTML = `
        <h3>Final Result</h3>
        <p>You got <strong>${score}</strong> out of <strong>${questions.length}</strong> questions correct!</p>
        <p>Wrong answers: <strong>${wrongAnswers}</strong></p>
        <p>Total time: <strong>${totalTime}</strong></p>
    `;
    questionsContainer.appendChild(resultSummary);

    document.querySelectorAll('input[type="radio"]').forEach((input) => {
        input.disabled = true;
    });

    const submitButton = document.querySelector(".submit-button");
    if (submitButton) submitButton.remove();

    displayMessage(`You got ${score} out of ${questions.length} questions correct!`, 'success');

    return { score, wrongAnswers };
}

async function processSubmission(subject, questions, score, wrongAnswers) {
    const userId = await checkAuthState();

    let formattedQuestions = [];

    if (Array.isArray(questions)) {
        formattedQuestions = questions.map((question, index) => formatQuestion(question, index));
    } else if (typeof questions === 'object' && questions !== null) {
        formattedQuestions.push(formatQuestion(questions, 0));
    } else if (typeof questions === 'string') {
        formattedQuestions.push({
            statement: questions,
            alternatives: {},
            correctAnswer: "N/A",
            userAnswer: "Not answered",
            correct: 0,
            incorrect: 1,
            comment: ""
        });
    } else {
        console.error("Unknown 'questions' format:", questions);
    }

    await saveSimuladoResult(userId, subject, formattedQuestions, score, wrongAnswers);
}

function formatQuestion(question, index) {
    const selected = document.querySelector(`input[name="question${index}"]:checked`);
    const userAnswer = selected ? selected.value : "Not answered";

    return {
        statement: question.statement || "No statement",
        alternatives: question.alternatives || {},
        correctAnswer: question.correctAnswer || "N/A",
        userAnswer: userAnswer,
        correct: userAnswer === question.correctAnswer ? 1 : 0,
        incorrect: userAnswer !== question.correctAnswer ? 1 : 0,
        comment: question.comment || ""
    };
}

// Footer
const footerLinks = document.querySelectorAll(".footer-nav a");
footerLinks.forEach((link) => {
    if (link.href === window.location.href) link.classList.add("active");
    link.addEventListener("click", () => {
        footerLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
    });
});

// Mensagem dinâmica
function displayMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) return;
    messageContainer.innerHTML = '';

    const messageElement = document.createElement('div');
    messageElement.classList.add('message',
        type === 'success' ? 'message-success' :
        type === 'error' ? 'message-error' : 'message-info'
    );
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}
