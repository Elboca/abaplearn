// pages/exercicios.js
import Head from 'next/head';
import Header from '../components/Header';
import Exercicios from '../components/Exercicios';

const Exercicios = () => {
  const [subject, setSubject] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [timerDuration, setTimerDuration] = useState(30);
  const [timer, setTimer] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleSubjectChange = (subject) => {
    setSubject(subject);
  };

  const handleQuestionCountChange = (event) => {
    setQuestionCount(event.target.value);
  };

  const handleTimerDurationChange = (event) => {
    setTimerDuration(event.target.value);
  };

  const startTimer = () => {
    if (!timerRunning) {
      clearInterval(timer);
      setSeconds(timerDuration * 60);
      setTimer(setInterval(updateTimer, 1000));
      setTimerRunning(true);
    }
  };

  const pauseTimer = () => {
    clearInterval(timer);
    setTimerRunning(false);
  };

  const resumeTimer = () => {
    if (!timerRunning) {
      setTimer(setInterval(updateTimer, 1000));
      setTimerRunning(true);
    }
  };

  const updateTimer = () => {
    if (seconds > 0) {
      setSeconds(seconds - 1);
    } else {
      clearInterval(timer);
      setTimerRunning(false);
      alert('Tempo esgotado!');
    }
  };

  const generateExercises = async () => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: `Gere ${questionCount} questões de múltipla escolha sobre ${subject} no estilo do ENEM. Cada questão deve ter um enunciado e 5 alternativas (A, B, C, D, E). Indique a resposta correta para cada questão no formato 'Resposta: X', onde X é a letra da alternativa correta. Não dê saudações, traga apenas as questões.`,
            },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar exercícios');
      }

      const data = await response.json();
      const questions = parseQuestionsFromResponse(data.choices[0].message.content);
      displayQuestions(questions);
    } catch (error) {
      console.error('Erro ao gerar exercícios:', error);
      alert('Ocorreu um erro ao gerar os exercícios. Por favor, tente novamente.');
    }
  };

  const parseQuestionsFromResponse = (content) => {
    // Implemente a lógica para analisar o conteúdo da resposta e extrair as questões
    // Este é um exemplo simplificado e pode precisar ser ajustado com base no formato exato da resposta
    const questions = [];
    const questionBlocks = content.split(/\d+\.\s/).filter(Boolean);

    questionBlocks.forEach((block, index) => {
      const lines = block.split('\n').filter(Boolean);
      const enunciado = lines[0].trim();
      const alternativas = {};
      let resposta_correta = '';

      lines.slice(1).forEach((line) => {
        if (
          line.toLowerCase().startsWith('resposta:') ||
          line.toLowerCase().startsWith('resposta correta:')
        ) {
          resposta_correta = line.split(':')[1].trim();
        } else {
          const [letter, text] = line.split(') ');
          if (letter && text) {
            alternativas[letter.trim()] = text.trim();
          }
        }
      });

      const respostaLine = lines[lines.length - 1];
      if (!resposta_correta && Object.keys(alternativas).length > 0) {
        resposta_correta = Object.keys(alternativas)[0];
      }

      questions.push({
        enunciado,
        alternativas,
        resposta_correta,
      });
    });

    return questions;
  };

  const displayQuestions = (questions) => {
    questionsContainer.innerHTML = '';
    questions.forEach((question, index) => {
      const questionElement = document.createElement('div');
      questionElement.classList.add('question');
      questionElement.innerHTML = `
        <h3>Questão ${index + 1}</h3>
        <p>${question.enunciado}</p>
        <ul class="options">
          ${Object.entries(question.alternativas)
            .map(([letter, text]) => `
              <li class="option">
                <label>
                  <input type="radio" name="question${index}" value="${letter}">
                  ${letter}) ${text}
                </label>
              </li>
            `)
            .join('')}
        </ul>
      `;
      questionsContainer.appendChild(questionElement);
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Enviar Respostas';
    submitButton.classList.add('submit-button');
    submitButton.addEventListener('click', () => {
      checkAnswers(questions);
      clearInterval(timer);
      setTimerRunning(false);
    });
    questionsContainer.appendChild(submitButton);
  };

  const checkAnswers = (questions) => {
    let score = 0;
    questions.forEach((question, index) => {
      const questionElement = document.querySelector(`.question:nth-child(${index + 1})`);
      const selectedAnswer = questionElement.querySelector(
        `input[name="question${index}"]:checked`
      );
      const correctAnswer = question.resposta_correta;

      const resultElement = document.createElement('p');
      resultElement.style.marginTop = '10px';

      if (selectedAnswer) {
        if (selectedAnswer.value === correctAnswer) {
          score++;
          resultElement.textContent = `Correto! A resposta é ${correctAnswer}.`;
          resultElement.classList.add('correct-answer');
        } else {
          resultElement.textContent = `Incorreto. A resposta correta é ${correctAnswer}.`;
          resultElement.classList.add('incorrect-answer');
        }
      } else {
        resultElement.textContent = `Não respondido. A resposta correta é ${correctAnswer}.`;
        resultElement.classList.add('incorrect-answer');
      }

      questionElement.appendChild(resultElement);
    });

    const totalTime = timerDisplay.textContent;
    const resultSummary = document.createElement('div');
    resultSummary.classList.add('result-summary');
    resultSummary.innerHTML = `
      <h3>Resultado Final</h3>
      <p>Você acertou ${score} de ${questions.length} questões!</p>
      <p>Tempo total: ${totalTime}</p>
    `;
    questionsContainer.appendChild(resultSummary);

    // Desabilitar inputs após submissão
    document.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.disabled = true;
    });

    // Remover o botão de enviar
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
      submitButton.remove();
    }
  };

  const timerDisplay = document.getElementById('time');
  const questionsContainer = document.createElement('div');
  questionsContainer.classList.add('questions-container');

  return (
    <>
      <Head>
        <title>Exercícios</title>
      </Head>
      <Header />
      <main>
        <div className="container">
          <h1>Exercícios do ENEM</h1>
          <div className="subject-selector">
            <button
              className="subject-button"
              data-subject="Ciências Naturais"
              onClick={() => handleSubjectChange('Ciências Naturais')}
            >
              Ciências Naturais
            </button>
            <button
              className="subject-button"
              data-subject="Ciências Humanas"
              onClick={() => handleSubjectChange('Ciências Humanas')}
            >
              Ciências Humanas
            </button>
            <button
              className="subject-button"
              data-subject="Língua Portuguesa"
              onClick={() => handleSubjectChange('Língua Portuguesa')}
            >
              Língua Portuguesa
            </button>
            <button
              className="subject-button"
              data-subject="Matemática"
              onClick={() => handleSubjectChange('Matemática')}
            >
              Matemática
            </button>
            <button
              className="subject-button"
              data-subject="Linguagens"
              onClick={() => handleSubjectChange('Linguagens')}
            >
              Linguagens
            </button>
          </div>
          <div className="options-container">
            <div className="question-count">
              <label for="questionCount">
                Número de questões:
              </label>
              <input
                type="number"
                id="questionCount"
                min="5"
                max="45"
                value={questionCount}
                onChange={(event) => handleQuestionCountChange(event.target.value)}
              />
            </div>
            <div className="timer-container">
              <label for="timerDuration">
                Tempo (minutos):
              </label>
              <input
                type="number"
                id="timerDuration"
                min="1"
                max="180"
                value={timerDuration}
                onChange={(event) => handleTimerDurationChange(event.target.value)}
              />
            </div>
            <div className="timer">
              <span id="time">
                {seconds.toString().padStart(2, '0')}
                :
                {Math.floor(timerDuration).toString().padStart(2, '0')}
              </span>
              <div className="timer-buttons">
                <button
                  id="startTimer"
                  className="timer-button"
                  onClick={() => startTimer()}
                >
                  Iniciar
                </button>
                <button
                  id="pauseTimer"
                  className="timer-button"
                  onClick={() => pauseTimer()}
                >
                  Pausar
                </button>
                <button
                  id="resumeTimer"
                  className="timer-button"
                  onClick={() => resumeTimer()}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
          <button
            className="generate-button"
            onClick={() => generateExercises()}
          >
            Gerar Exercícios
          </button>
          <div ref={(element) => (questionsContainer = element)} />
        </div>
      </main>
    </>
  );
};

export default Exercicios;
