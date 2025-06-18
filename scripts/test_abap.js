import { checkAuthState, checkMessageBalance, saveSimulatedExamResult } from './authval.js';

// Ensure to store your API key securely
const apiKey = 'sk-svcacct-rCZJ4KlGZ1OVeWDVXCjKcX8zkZ7FcYwGd4ooDZ6m1WIrc2M3IgGJj6urQEQhMJT3BlbkFJeP4BeVA70sjes2-6AlD3qthVL69vdrjSSQ-oexFAy0sfebFHexHQ59hMSgxJQA'; // Atenção: Chave de API exposta no código! Recomenda-se gerenciar via backend.

document.addEventListener('DOMContentLoaded', function () {
    // ... (código do menu e inicialização mantido como antes) ...
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('show');
            menu.classList.toggle('hidden');
        });

        document.addEventListener('click', (event) => {
            const isClickInsideMenu = menu.contains(event.target);
            const isClickOnMenuToggle = menuToggle.contains(event.target);
            if (!isClickInsideMenu && !isClickOnMenuToggle && window.innerWidth < 768) {
                if (menu.classList.contains('show')) {
                    menu.classList.remove('show');
                    menu.classList.add('hidden');
                }
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth < 768 && menu && menu.classList.contains('show')) {
                menu.classList.remove('show');
                menu.classList.add('hidden');
            }
        });
    });

    if (document.querySelector(".generate-button")) {
        initializeTestsModule();
    }
});

async function getExplanationForIncorrectAnswer(question, userAnswer, correctAnswer) {
    // Validação básica das entradas
    if (!question || !question.enunciado || !question.alternativas || !userAnswer || !correctAnswer || !question.alternativas[userAnswer] || !question.alternativas[correctAnswer]) {
        console.error("Dados insuficientes para gerar explicação:", { question, userAnswer, correctAnswer });
        return "Could not generate explanation due to missing data.";
    }

    const prompt = `Question: "${question.enunciado}"
User answered: "${userAnswer}) ${question.alternativas[userAnswer]}"
Correct answer is: "${correctAnswer}) ${question.alternativas[correctAnswer]}"

Please explain concisely (around 2-3 sentences) why the user's answer is incorrect and why the correct answer is the right choice for this ABAP question. Focus on the technical reasoning.`;

    try {
        // Considerar adicionar verificação de saldo de mensagens aqui se aplicável
        // const userId = await checkAuthState();
        // const hasBalance = await checkMessageBalance(userId);
        // if (!hasBalance) return "Could not fetch explanation due to message balance.";

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                max_tokens: 250, // Aumentado para permitir explicações um pouco mais longas
                temperature: 0.5
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error Data fetching explanation:", errorData);
            throw new Error(`API Error (${response.status}): ${errorData?.error?.message || response.statusText}`);
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0 && data.choices[0].message?.content) {
            // Limpeza básica da resposta da API
            let explanation = data.choices[0].message.content.trim();
            // Remover frases genéricas iniciais se presentes
            explanation = explanation.replace(/^Here's an explanation:/i, '').trim();
            explanation = explanation.replace(/^Okay, here's the explanation:/i, '').trim();
            return explanation;
        } else {
            console.warn("Formato de resposta inesperado da API de explicação:", data);
            return "Could not retrieve a valid explanation from the service.";
        }
    } catch (error) {
        console.error("Error getting explanation:", error);
        // Retornar mensagem de erro mais específica se possível
        return `Error fetching explanation: ${error.message}`; 
    }
}

export function initializeTestsModule() {
    const generateButton = document.querySelector(".generate-button");
    const questionsContainer = document.querySelector(".questions-container");
    const questionCountInput = document.getElementById("questionCount");
    const timerDurationInput = document.getElementById("timerDuration");
    const timerDisplay = document.getElementById("time");
    const controlTimerButton = document.getElementById("controlTimer");
    const subjectSelect = document.getElementById("subjectSelect");
    const messageContainer = document.getElementById("messageContainer");

    let selectedSubject = "";
    let timer;
    let seconds = 0;
    let timerRunning = false;
    let currentQuestions = [];

    if (subjectSelect) {
        subjectSelect.addEventListener("change", () => {
            selectedSubject = subjectSelect.value;
        });
    }

    if (generateButton) {
        generateButton.addEventListener("click", () => {
            if (!selectedSubject) {
                displayMessage("Please select a subject before generating exercises.", 'error');
                return;
            }
            const questionCount = parseInt(questionCountInput.value);
            if (isNaN(questionCount) || questionCount < 5 || questionCount > 45) {
                displayMessage("Please choose a number of questions between 5 and 45.", 'error');
                return;
            }
            const timerDuration = parseInt(timerDurationInput.value);
             if (isNaN(timerDuration) || timerDuration < 1 || timerDuration > 180) {
                displayMessage("Please choose a timer duration between 1 and 180 minutes.", 'error');
                return;
            }

            generateExercises(questionCount);

             if (timerDuration > 0) {
                startTimer(timerDuration);
                if(controlTimerButton) controlTimerButton.textContent = "Pause";
            } else {
                 if(timerDisplay) timerDisplay.textContent = "-";
                 if(controlTimerButton) controlTimerButton.style.display = 'none';
            }
        });
    }

    if (controlTimerButton) {
        controlTimerButton.addEventListener("click", () => {
            if (controlTimerButton.textContent === "Start") {
                 const timerDuration = parseInt(timerDurationInput.value);
                 if (!isNaN(timerDuration) && timerDuration > 0) {
                    startTimer(timerDuration);
                    controlTimerButton.textContent = "Pause";
                 } else {
                     displayMessage("Please set a valid timer duration first.", 'error');
                 }
            } else if (controlTimerButton.textContent === "Pause") {
                pauseTimer();
                controlTimerButton.textContent = "Resume";
            } else if (controlTimerButton.textContent === "Resume") {
                resumeTimer();
                controlTimerButton.textContent = "Pause";
            }
        });
    }

    // Check auth state on load
    checkAuthState().then(userId => {
        if (userId) {
            console.log('Authentication successful, User ID:', userId);
        } else {
             console.log('User not authenticated, redirecting to login.');
             if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
                window.location.href = '/index.html';
             }
        }
    }).catch(error => {
        console.error('Authentication check failed:', error);
         if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
             window.location.href = '/index.html';
         }
    });

    function startTimer(durationMinutes) {
        if (!timerRunning) {
            clearInterval(timer);
            seconds = durationMinutes * 60;
             if(timerDisplay) updateTimerDisplay();
            timer = setInterval(updateTimer, 1000);
            timerRunning = true;
        }
    }

    function pauseTimer() {
        clearInterval(timer);
        timerRunning = false;
    }

    function resumeTimer() {
        if (!timerRunning && seconds > 0) {
            timer = setInterval(updateTimer, 1000);
            timerRunning = true;
        }
    }

     function updateTimer() {
        if (seconds > 0) {
            seconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            timerRunning = false;
            displayMessage("Time's up!", 'info');
            if(controlTimerButton) controlTimerButton.textContent = "Start";
             // Consider automatically submitting answers when time runs out
             checkAnswers(currentQuestions, true); // Pass flag indicating time out
             // disableInputs(); // disableInputs is called within checkAnswers now
        }
    }

    function updateTimerDisplay() {
         if (timerDisplay) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
         }
    }

    async function generateExercises(questionCount) {
        if (!questionsContainer) return;
        questionsContainer.innerHTML = "<p class='text-center p-4 text-gray-600'>Generating exercises, please wait...</p>";
        if(controlTimerButton) controlTimerButton.disabled = true;
        if(generateButton) generateButton.disabled = true;
        currentQuestions = []; // Reset questions

        try {
            const userId = await checkAuthState();
            if (!userId) throw new Error("User not authenticated.");

            const hasBalance = await checkMessageBalance(userId);
            if (!hasBalance) {
                 displayMessage("You don't have enough message balance to generate exercises.", 'error');
                 questionsContainer.innerHTML = "<p class='text-center p-4 text-red-500'>Failed to generate: Insufficient balance.</p>";
                 if(generateButton) generateButton.disabled = false;
                 return;
            }

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{
                        role: "user",
                        content: `Generate ${questionCount} multiple-choice questions about the ABAP topic: ${selectedSubject}. Each question must have a statement and exactly 5 alternatives labeled A, B, C, D, E. Clearly indicate the correct answer for each question using the format 'Correct Answer: X' on a new line after the alternatives. Provide a brief hint or context for the correct answer where applicable, perhaps in parentheses after the 'Correct Answer:' line. Format questions starting with '1.', '2.', etc. Be concise.`
                    }],
                    max_tokens: 2500, // Increased slightly for hints and longer questions
                    temperature: 0.6
                })
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 console.error("API Error during generation:", errorData);
                throw new Error(`Failed to generate exercises: ${errorData?.error?.message || response.statusText}`);
            }

            const data = await response.json();
            if (!data.choices || data.choices.length === 0 || !data.choices[0].message?.content) {
                throw new Error("Invalid response format from API.");
            }

            currentQuestions = parseQuestionsFromResponse(data.choices[0].message.content);
            if (currentQuestions.length === 0) {
                console.warn("No questions were successfully parsed from the API response.", data.choices[0].message.content);
                throw new Error("Failed to parse questions from the generated content. The format might be incorrect.");
            }
            displayQuestions(currentQuestions);

        } catch (error) {
            console.error("Error generating exercises:", error);
            questionsContainer.innerHTML = `<p class='text-center p-4 text-red-500'>An error occurred: ${error.message}. Please try again.</p>`;
            displayMessage(`Error generating exercises: ${error.message}`, 'error');
        } finally {
             if(controlTimerButton) controlTimerButton.disabled = false;
             if(generateButton) generateButton.disabled = false;
        }
    }

    function parseQuestionsFromResponse(content) {
        const questions = [];
        const questionBlocks = content.split(/\n?(?:\d+\.|\*\*Question \d+\.*\*)\s+/).filter(block => block.trim().length > 0);

        questionBlocks.forEach((block, index) => {
            const lines = block.trim().split('\n').filter(line => line.trim().length > 0);
            if (lines.length < 6) {
                console.warn(`Skipping block ${index + 1}: Not enough lines.`);
                return;
            }

            const enunciado = lines[0].trim();
            const alternativas = {};
            let resposta_correta = "";
            let explanationHint = "";
            let optionsFound = 0;

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                const optionMatch = line.match(/^([A-Ea-e])(?:\.|\)|-)\s+(.*)/);
                if (optionMatch && optionsFound < 5) {
                    const letter = optionMatch[1].toUpperCase();
                    alternativas[letter] = optionMatch[2].trim();
                    optionsFound++;
                } else {
                    const answerMatch = line.match(/(?:Correct Answer|Answer):\s*([A-Ea-e])(?:\s*\((.*)\))?/i);
                    if (answerMatch) {
                        resposta_correta = answerMatch[1].toUpperCase();
                        if (answerMatch[2]) {
                            explanationHint = answerMatch[2].trim();
                        }
                        break; // Stop processing lines for this question once answer is found
                    }
                }
            }

            if (enunciado && Object.keys(alternativas).length === 5 && resposta_correta) {
                 questions.push({ enunciado, alternativas, resposta_correta, explanationHint });
            } else {
                 console.warn(`Skipping malformed question block ${index + 1}:`, { enunciado, optionsCount: Object.keys(alternativas).length, resposta_correta });
            }
        });
        console.log("Parsed questions:", questions);
        return questions;
    }

    function displayQuestions(questions) {
        if (!questionsContainer) return;
        questionsContainer.innerHTML = "";
        questions.forEach((question, index) => {
            const questionElement = document.createElement("div");
            questionElement.classList.add("question", "mb-6", "p-4", "border", "border-gray-300", "rounded", "bg-white", "shadow");
            questionElement.setAttribute('data-question-index', index);

            let optionsHTML = Object.entries(question.alternativas).map(([letter, text]) => `
                <div class="mb-2 option-item">
                    <input type="radio" id="q${index}${letter}" name="question${index}" value="${letter}" class="mr-2">
                    <label for="q${index}${letter}" class="option-label">${letter}) ${text}</label>
                </div>
            `).join('');

            questionElement.innerHTML = `
                <h3 class="font-semibold mb-2 text-lg">Question ${index + 1}</h3>
                <p class="mb-3 text-gray-700">${question.enunciado}</p>
                <div class="options-group">${optionsHTML}</div>
                <div class="result-feedback mt-3" style="display: none;"></div>
            `;
            questionsContainer.appendChild(questionElement);
        });

        if (questions.length > 0) {
            const submitButton = document.createElement("button");
            submitButton.textContent = "Submit Answers";
            submitButton.id = "submitAnswersBtn"; // Add ID for easier selection
            submitButton.classList.add("submit-button", "mt-6", "bg-pink-500", "text-white", "px-6", "py-2", "rounded", "hover:bg-pink-600", "font-semibold");
            submitButton.addEventListener("click", async () => {
                submitButton.disabled = true;
                submitButton.textContent = "Processing...";
                await checkAnswers(questions);
            });
            questionsContainer.appendChild(submitButton);
        } else {
             questionsContainer.innerHTML = "<p class='text-center p-4 text-gray-600'>No questions generated or parsed correctly. Please try again.</p>";
        }
    }

    async function checkAnswers(questions, timedOut = false) {
        let score = 0;
        let wrongAnswers = 0;
        let correctAnswers = 0;
        const totalQuestions = questions.length;
        let explanationsPending = 0;

        // Stop the timer immediately
        clearInterval(timer);
        timerRunning = false;

        // Disable inputs and submit button right away
        disableInputs();
        const submitButton = questionsContainer.querySelector("#submitAnswersBtn");
        if (submitButton) {
            submitButton.textContent = "Checking...";
            submitButton.disabled = true;
        }

        questions.forEach((question, index) => {
            const questionElement = questionsContainer.querySelector(`.question[data-question-index="${index}"]`);
            if (!questionElement) return;

            const selectedAnswerInput = questionElement.querySelector(`input[name="question${index}"]:checked`);
            const correctAnswer = question.resposta_correta;
            const resultFeedbackElement = questionElement.querySelector('.result-feedback');
            resultFeedbackElement.style.display = 'block';
            resultFeedbackElement.innerHTML = ''; // Clear previous feedback

            const selectedValue = selectedAnswerInput ? selectedAnswerInput.value : null;
            const options = questionElement.querySelectorAll('.option-item');

            // Reset previous highlights
            options.forEach(opt => {
                const label = opt.querySelector('.option-label');
                if (label) {
                    label.classList.remove('correct-answer-highlight', 'incorrect-answer-highlight', 'correct-answer-reveal');
                }
            });

            if (!correctAnswer) {
                console.error(`Missing correct answer for question ${index + 1}`);
                resultFeedbackElement.innerHTML = `<p class="text-red-600 font-semibold">Error: Could not determine the correct answer for this question.</p>`;
                wrongAnswers++; // Count as wrong if correct answer is missing
                return; // Skip further processing for this question
            }

            const correctLabelElement = questionElement.querySelector(`label[for="q${index}${correctAnswer}"]`);

            if (selectedValue) {
                const isCorrect = selectedValue === correctAnswer;
                const selectedLabelElement = questionElement.querySelector(`label[for="q${index}${selectedValue}"]`);

                if (isCorrect) {
                    score++;
                    correctAnswers++;
                    resultFeedbackElement.innerHTML = `<p class="text-green-600 font-semibold"><i class="fas fa-check-circle mr-1"></i>Correct! The answer is ${correctAnswer}.</p>`;
                    if(selectedLabelElement) selectedLabelElement.classList.add('correct-answer-highlight');
                    if (question.explanationHint) {
                         resultFeedbackElement.innerHTML += `<p class="text-sm text-gray-600 mt-1">Hint: ${question.explanationHint}</p>`;
                    }
                } else {
                    wrongAnswers++;
                    resultFeedbackElement.innerHTML = `<p class="text-red-600 font-semibold"><i class="fas fa-times-circle mr-1"></i>Incorrect. The correct answer is ${correctAnswer}.</p>`;
                    if(selectedLabelElement) selectedLabelElement.classList.add('incorrect-answer-highlight');
                    if(correctLabelElement) correctLabelElement.classList.add('correct-answer-reveal'); // Highlight the correct one too

                    // Add placeholder for explanation and fetch it
                    const explanationPlaceholder = document.createElement('p');
                    explanationPlaceholder.className = 'explanation-placeholder text-sm text-gray-600 mt-1 italic';
                    explanationPlaceholder.textContent = 'Loading explanation...';
                    resultFeedbackElement.appendChild(explanationPlaceholder);

                    explanationsPending++;
                    getExplanationForIncorrectAnswer(question, selectedValue, correctAnswer)
                        .then(explanation => {
                            explanationPlaceholder.textContent = explanation;
                            explanationPlaceholder.classList.remove('italic');
                            // Check if explanation indicates an error
                            if (explanation.toLowerCase().includes('error') || explanation.toLowerCase().includes('could not')) {
                                explanationPlaceholder.classList.add('text-red-500');
                            }
                        })
                        .catch(error => {
                             console.error("Failed to display explanation:", error);
                             explanationPlaceholder.textContent = 'Error loading explanation.';
                             explanationPlaceholder.classList.add('text-red-500');
                             explanationPlaceholder.classList.remove('italic');
                        })
                        .finally(() => {
                            explanationsPending--;
                            updateResultSummary(score, totalQuestions, timedOut, explanationsPending);
                        });
                }
            } else {
                wrongAnswers++;
                resultFeedbackElement.innerHTML = `<p class="text-yellow-600 font-semibold"><i class="fas fa-question-circle mr-1"></i>Not answered. The correct answer is ${correctAnswer}.</p>`;
                if(correctLabelElement) correctLabelElement.classList.add('correct-answer-reveal');
            }
        });

        // Initial update for the summary (might show 0 pending)
        updateResultSummary(score, totalQuestions, timedOut, explanationsPending);

        // Save results (don't wait for explanations to save)
        saveResults(selectedSubject || 'Unknown Subject', questions, score, wrongAnswers, totalQuestions);

        // No need to return score/wrongAnswers here unless needed elsewhere
    }

    function updateResultSummary(currentScore, totalQuestions, timedOut, pendingCount) {
        const finalTime = timerDisplay ? timerDisplay.textContent : 'N/A';
        let resultSummary = questionsContainer.querySelector(".result-summary");
        if (!resultSummary) {
            resultSummary = document.createElement("div");
            resultSummary.classList.add("result-summary", "mt-8", "p-4", "bg-gray-200", "rounded", "shadow-inner");
            // Insert summary before the submit button if it exists, otherwise append
            const submitBtn = questionsContainer.querySelector('#submitAnswersBtn');
            if (submitBtn) {
                questionsContainer.insertBefore(resultSummary, submitBtn);
            } else {
                questionsContainer.appendChild(resultSummary);
            }
        }

        let pendingText = '';
        if (pendingCount > 0) {
            pendingText = `<p class="text-sm text-gray-600 italic">(${pendingCount} explanations still loading...)</p>`;
        }

        resultSummary.innerHTML = `
            <h3 class="font-bold text-xl mb-2 text-center">Final Result</h3>
            <p class="text-center text-lg">You got <strong>${currentScore}</strong> out of <strong>${totalQuestions}</strong> questions correct!</p>
            ${timerDisplay && seconds > 0 ? `<p class="text-center text-sm text-gray-700">Time remaining: ${finalTime}</p>` : ''}
            ${timedOut ? '<p class="text-center text-red-500 font-semibold">Time ran out!</p>' : ''}
            ${pendingText}
        `;

        // Update submit button text when all explanations are loaded
        if (pendingCount === 0) {
            const submitButton = questionsContainer.querySelector("#submitAnswersBtn");
            if (submitButton) {
                submitButton.textContent = "Answers Submitted";
                submitButton.disabled = true; // Ensure it stays disabled
            }
            displayMessage(`Test finished! Score: ${currentScore}/${totalQuestions}`, 'success');
        }
    }

    function disableInputs() {
         if (!questionsContainer) return;
         questionsContainer.querySelectorAll('input[type="radio"]').forEach((input) => {
            input.disabled = true;
        });
    }

    async function saveResults(subject, questions, score, wrongAnswersCount, totalQuestions) {
        try {
            const userId = await checkAuthState();
            if (!userId) {
                console.warn("Cannot save results: User not authenticated.");
                return;
            }

            const formattedResults = questions.map((q, idx) => formatQuestionForSave(q, idx));

            await saveSimulatedExamResult(userId, subject, formattedResults, score, wrongAnswersCount, totalQuestions);
            console.log("Simulated exam results saved successfully.");

        } catch (error) {
            console.error("Error saving simulated exam results:", error);
            displayMessage("An error occurred while saving your results.", 'error');
        }
    }

    function formatQuestionForSave(question, index) {
        // Ensure the query selector targets the container where questions are rendered
        const questionElement = questionsContainer?.querySelector(`.question[data-question-index="${index}"]`);
        const selectedAnswerInput = questionElement?.querySelector(`input[name="question${index}"]:checked`);
        const userAnswer = selectedAnswerInput ? selectedAnswerInput.value : "Not answered";
        const isCorrect = userAnswer === question.resposta_correta;

        return {
            enunciado: question.enunciado || "N/A",
            alternativas: question.alternativas || {},
            resposta_correta: question.resposta_correta || "N/A",
            resposta_usuario: userAnswer,
            correta: isCorrect ? 1 : 0,
            errada: !isCorrect && userAnswer !== "Not answered" ? 1 : 0,
            nao_respondida: userAnswer === "Not answered" ? 1 : 0
        };
    }

    function displayMessage(message, type = 'info') {
        if (!messageContainer) {
            console.log(`Message (${type}): ${message}`);
            return;
        }
        messageContainer.innerHTML = ''; // Clear previous messages
        const messageElement = document.createElement('div');
        let bgColor, textColor, borderColor, iconClass;
        switch (type) {
            case 'success':
                bgColor = 'bg-green-100'; textColor = 'text-green-700'; borderColor = 'border-green-400'; iconClass = 'fas fa-check-circle';
                break;
            case 'error':
                bgColor = 'bg-red-100'; textColor = 'text-red-700'; borderColor = 'border-red-400'; iconClass = 'fas fa-exclamation-triangle';
                break;
            case 'info':
            default:
                bgColor = 'bg-blue-100'; textColor = 'text-blue-700'; borderColor = 'border-blue-400'; iconClass = 'fas fa-info-circle';
                break;
        }
        messageElement.className = `message ${bgColor} ${textColor} p-3 rounded border ${borderColor} mb-4 shadow flex items-center`;
        messageElement.innerHTML = `<i class="${iconClass} mr-2"></i> ${message}`;
        messageContainer.appendChild(messageElement);

        setTimeout(() => {
            if (messageElement.parentNode === messageContainer) {
                 messageElement.remove();
            }
        }, 5000);
    }
}

