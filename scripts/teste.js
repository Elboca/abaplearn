import {
    checkAuthState,
    checkSaldoMensagens 
} from './authValidation_simp.js';

// Replace 'YOUR_API_KEY' with your actual key, ensuring that this file remains secure and hidden from the client
const apiKey = "sk-svcacct-rCZJ4KlGZ1OVeWDVXCjKcX8zkZ7FcYwGd4ooDZ6m1WIrc2M3IgGJj6urQEQhMJT3BlbkFJeP4BeVA70sjes2-6AlD3qthVL69vdrjSSQ-oexFAy0sfebFHexHQ59hMSgxJQA";

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

// Event listeners for the selects

subjectSelect.addEventListener("change", () => {
    selectedSubject = subjectSelect.value;
});

generateButton.addEventListener("click", () => {

    if (!selectedSubject) {
        displayMessage("Please, select a test before generating exercises", 'error');
        return;
    }
    const questionCount = parseInt(questionCountInput.value);
    if (questionCount < 5 || questionCount > 30) {
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
        console.log("Starting authentication and balance check...");
        const isAuthenticated = await checkAuthState();
        console.log('Authentication and balance successfully verified:', isAuthenticated);
    } catch (error) {
        console.error('Error checking authentication/balance:', error);
        window.location.href = '/index.html';
    }
});

function startTimer() {
    if (!timerRunning) {
        clearInterval(timer);
        seconds = parseInt(timerDurationInput.value) * 60;
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
        displayMessage("Time's up!", 'info');
        controlTimerButton.textContent = "Start";
    }
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
                    content: `Generate ${questionCount} multiple-choice questions about ${selectedSubject} in ABAP programming. Each question should have a statement and 5 alternatives (A, B, C, D, E). Indicate the correct answer for each question in the format 'Answer: X', where X is the letter of the correct alternative. Do not give greetings, just provide the questions.`
                }],
                max_tokens: 4000,
                temperature: 0.5,

            })
        });

        if (!response.ok) {
            throw new Error("Failed to generate exercises");
        }

        const data = await response.json();
        const questions = parseQuestionsFromResponse(data.choices[0].message.content);
        displayQuestions(questions);
    } catch (error) {
        console.error("Error generating exercises:", error);
        questionsContainer.innerHTML = "<p>An error occurred while generating the exercises. Please try again.</p>";
        displayMessage("Error generating exercises. Please try again later.", 'error');
    }
}

function parseQuestionsFromResponse(content) {
    const questions = [];
    const questionBlocks = content.split(/\d+\.\s/).filter(Boolean);

    questionBlocks.forEach((block, index) => {
        const lines = block.split("\n").filter(Boolean);
        const statement = lines[0].trim();
        const alternatives = {};
        let correctAnswer = "";

        lines.slice(1).forEach((line) => {
            if (
                line.toLowerCase().startsWith("answer:") ||
                line.toLowerCase().startsWith("correct answer:")
            ) {
                correctAnswer = line.split(":")[1].trim();
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
            correctAnswer
        });
    });

    return questions;
}

function displayQuestions(questions) {
    console.log("Displaying questions:", questions);
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
        const {
            score,
            wrongAnswers
        } = checkAnswers(questions);
        clearInterval(timer);
        timerRunning = false;
        await processSubmission(selectedSubject, questions, score, wrongAnswers);
    });
    questionsContainer.appendChild(submitButton);
}

function checkAnswers(questions) {
    let score = 0;
    let wrongAnswers = 0;

    // Remove resultados anteriores, se existirem
    document.querySelectorAll('.correct-answer, .incorrect-answer').forEach(e => e.remove());
    const oldSummary = document.querySelector('.result-summary');
    if (oldSummary) oldSummary.remove();

    questions.forEach((question, index) => {
        // Busca o elemento da questão de forma mais robusta
        const questionElement = questionsContainer.querySelectorAll('.question')[index];
        const selectedAnswer = questionElement.querySelector(`input[name="question${index}"]:checked`);
        const correctAnswer = question.correctAnswer;

        const resultElement = document.createElement("p");
        resultElement.style.marginTop = "10px";

        if (selectedAnswer) {
            if (selectedAnswer.value === correctAnswer) {
                score++;
                resultElement.textContent = `Correct! The answer is ${correctAnswer}.`;
                resultElement.classList.add("correct-answer");
            } else {
                resultElement.textContent = `Incorrect! The answer is ${correctAnswer}.`;
                resultElement.classList.add("incorrect-answer");
                wrongAnswers++;
            }
        } else {
            resultElement.textContent = `Not answered. The correct answer is ${correctAnswer}.`;
            resultElement.classList.add("incorrect-answer");
            wrongAnswers++;
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

    // Disable inputs after submission
    document.querySelectorAll('input[type="radio"]').forEach((input) => {
        input.disabled = true;
    });

    const submitButton = document.querySelector(".submit-button");
    if (submitButton) {
        submitButton.remove();
    }

    displayMessage(`You got ${score} out of ${questions.length} questions correct!`, 'success');

    return {
        score,
        wrongAnswers
    };
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
            incorrect: 1
        });
    } else {
        console.error("Unknown 'questions' format:", questions);
    }

    console.log("Formatted questions to save:", formattedQuestions);

    await saveSimuladoResult(userId, subject, formattedQuestions, score, wrongAnswers);
}

function formatQuestion(question, index) {
    const userAnswer = document.querySelector(`input[name="question${index}"]:checked`) ?.value || "Not answered";

    return {
        statement: question.statement || "No statement",
        alternatives: question.alternatives || {},
        correctAnswer: question.correctAnswer || "N/A",
        userAnswer: userAnswer,
        correct: userAnswer === question.correctAnswer ? 1 : 0,
        incorrect: userAnswer !== question.correctAnswer ? 1 : 0
    };
}

const footerLinks = document.querySelectorAll(".footer-nav a");
footerLinks.forEach((link) => {
    if (link.href === window.location.href) {
        link.classList.add("active");
    }

    link.addEventListener("click", () => {
        footerLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
    });
});

// displayMessage function as described
function displayMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = ''; // Clear previous messages

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    if (type === 'success') {
        messageElement.classList.add('message-success');
    } else if (type === 'error') {
        messageElement.classList.add('message-error');
    } else {
        messageElement.classList.add('message-info');
    }

    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}
