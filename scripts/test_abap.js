import {   checkAuthState,
checkMessageBalance,  saveSimulatedExamResult  } from './authval.js';
// abap-tests-module.js

// Ensure to store your API key securely
const apiKey = 'sk-svcacct-rCZJ4KlGZ1OVeWDVXCjKcX8zkZ7FcYwGd4ooDZ6m1WIrc2M3IgGJj6urQEQhMJT3BlbkFJeP4BeVA70sjes2-6AlD3qthVL69vdrjSSQ-oexFAy0sfebFHexHQ59hMSgxJQA';

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');

  // Toggle menu visibility (abre/fecha no mobile)
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('show');
  });

  // Handle navigation
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Fecha o menu ao clicar no link (apenas no mobile)
      if (window.innerWidth < 768) {
        menu.classList.add('hidden');
      }
    });
  });

  // Fecha o menu quando clicar fora dele no mobile
  document.addEventListener('click', (event) => {
    const isClickInsideMenu = menu.contains(event.target);
    const isClickOnMenuToggle = menuToggle.contains(event.target);

    if (!isClickInsideMenu && !isClickOnMenuToggle && window.innerWidth < 768) {
      menu.classList.add('hidden');
	  }
  });
});


export function initializeTestsModule() {
    const generateButton = document.querySelector(".generate-button");
    const questionsContainer = document.querySelector(".questions-container");
    const questionCountInput = document.getElementById("questionCount");
    const timerDurationInput = document.getElementById("timerDuration");
    const timerDisplay = document.getElementById("time");
    const controlTimerButton = document.getElementById("controlTimer");
    const testSelect = document.getElementById("testSelect");
    const subjectSelect = document.getElementById("subjectSelect");

    let selectedTest = "";
    let selectedSubject = "";
    let timer;
    let seconds = 0;
    let timerRunning = false;

    testSelect.addEventListener("change", () => {
        selectedTest = testSelect.value;
    });

    subjectSelect.addEventListener("change", () => {
        selectedSubject = subjectSelect.value;
    });

    generateButton.addEventListener("click", () => {
        if (!selectedTest) {
            displayMessage("Please select a test before generating exercises.", 'error');
            return;
        }
        if (!selectedSubject) {
            displayMessage("Please select a subject before generating exercises.", 'error');
            return;
        }
        const questionCount = parseInt(questionCountInput.value);
        if (questionCount < 5 || questionCount > 45) {
            displayMessage("Please choose a number of questions between 5 and 45.", 'error');
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
            controlTimerButton.textContent = "Resume";
        } else if (controlTimerButton.textContent === "Resume") {
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
            const response = await fetch("https://api.openai.com/v1/assistants/${assistantId}/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{
                        role: "user",
                        content: `Generate ${questionCount} multiple-choice questions about ${selectedSubject} for ${selectedTest} in ABAP programming. Each question should have a statement and 5 alternatives (A, B, C, D, E). Indicate the correct answer for each question in the format 'Answer: X', where X is the letter of the correct alternative. Do not give greetings, just provide the questions.`
                    }],
                    max_tokens: 1500,
                    temperature: 0.5
				
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
            const enunciado = lines[0].trim();
            const alternativas = {};
            let resposta_correta = "";
            lines.slice(1).forEach((line) => {
                if (line.toLowerCase().startsWith("answer:") || line.toLowerCase().startsWith("correct answer:")) {
                    resposta_correta = line.split(":")[1].trim();
                } else {
                    const [letter, text] = line.split(") ");
                    if (letter && text) {
                        alternativas[letter.trim()] = text.trim();
                    }
                }
            });
            questions.push({ enunciado, alternativas, resposta_correta });
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
                <h3 class="font-bold mb-2">Question ${index + 1}</h3>
                <p class="mb-2">${question.enunciado}</p>
                ${Object.entries(question.alternativas).map(([letter, text]) => `
                    <div class="mb-1">
                        <input type="radio" id="q${index}${letter}" name="question${index}" value="${letter}">
                        <label for="q${index}${letter}">${letter}) ${text}</label>
                    </div>
                `).join('')}
            `;
            questionsContainer.appendChild(questionElement);
        });
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit Answers";
        submitButton.classList.add("submit-button", "mt-4", "bg-blue-500", "text-white", "px-4", "py-2", "rounded", "hover:bg-blue-600");
        submitButton.addEventListener("click", async () => {
            const { score, wrongAnswers } = checkAnswers(questions);
            clearInterval(timer);
            timerRunning = false;
            await processSubmission(selectedSubject, questions, score, wrongAnswers);
        });
        questionsContainer.appendChild(submitButton);
    }

    function checkAnswers(questions) {
        let score = 0;
        let wrongAnswers = 0;
        questions.forEach((question, index) => {
            const questionElement = document.querySelector(`.question:nth-child(${index + 1})`);
            const selectedAnswer = questionElement.querySelector(`input[name="question${index}"]:checked`);
            const correctAnswer = question.resposta_correta;
            const resultElement = document.createElement("p");
            resultElement.style.marginTop = "10px";
            if (selectedAnswer) {
                if (selectedAnswer.value === correctAnswer) {
                    score++;
                    resultElement.textContent = `Correct! The answer is ${correctAnswer}.`;
                    resultElement.classList.add("text-green-600");
                } else {
                    resultElement.textContent = `Incorrect. The correct answer is ${correctAnswer}.`;
                    resultElement.classList.add("text-red-600");
                    wrongAnswers++;
                }
            } else {
                resultElement.textContent = `Not answered. The correct answer is ${correctAnswer}.`;
                resultElement.classList.add("text-red-600");
                wrongAnswers++;
            }
            questionElement.appendChild(resultElement);
        });
        const totalTime = timerDisplay.textContent;
        const resultSummary = document.createElement("div");
        resultSummary.classList.add("result-summary", "mt-4", "p-4", "bg-gray-100", "rounded");
        resultSummary.innerHTML = `
            <h3 class="font-bold mb-2">Final Result</h3>
            <p>You got ${score} out of ${questions.length} questions correct!</p>
            <p>Total time: ${totalTime}</p>
        `;
        questionsContainer.appendChild(resultSummary);
        document.querySelectorAll('input[type="radio"]').forEach((input) => {
            input.disabled = true;
        });
        const submitButton = document.querySelector(".submit-button");
        if (submitButton) {
            submitButton.remove();
        }
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
                enunciado: questions,
                alternativas: {},
                resposta_correta: "N/A",
                resposta_usuario: "Not answered",
                correta: 0,
                errada: 1
            });
        } else {
            console.error("Unknown format of 'questions':", questions);
        }
        console.log("Formatted questions to save:", formattedQuestions);
        await saveSimuladoResult(userId, subject, formattedQuestions, score, wrongAnswers);
    }

    function formatQuestion(question, index) {
        const respostaUsuario = document.querySelector(`input[name="question${index}"]:checked`)?.value || "Not answered";
        return {
            enunciado: question.enunciado || "No statement",
            alternativas: question.alternativas || {},
            resposta_correta: question.resposta_correta || "N/A",
            resposta_usuario: respostaUsuario,
            correta: respostaUsuario === question.resposta_correta ? 1 : 0,
            errada: respostaUsuario !== question.resposta_correta ? 1 : 0
        };
    }
}

export function displayMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = '';
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `message-${type}`, 'p-4', 'rounded', 'mb-4');
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}
// Certifique-se de armazenar sua chave de API de forma segura

