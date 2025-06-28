// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwNC4QWaBQYqvayl98oMArcGdYV0JuqSk",
  authDomain: "elearning-568mbq.firebaseapp.com",
  projectId: "elearning-568mbq",
  storageBucket: "elearning-568mbq.appspot.com",
  messagingSenderId: "956581108104",
  appId: "1:956581108104:web:2be9a9b0c5978cd4b3823d",
  measurementId: "G-WLB4FBXE9R"
};

// Firebase Initialization
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// OpenAI API Configuration
const apiKey = "sk-svcacct-rCZJ4KlGZ1OVeWDVXCjKcX8zkZ7FcYwGd4ooDZ6m1WIrc2M3IgGJj6urQEQhMJT3BlbkFJeP4BeVA70sjes2-6AlD3qthVL69vdrjSSQ-oexFAy0sfebFHexHQ59hMSgxJQA";

// Main Functions
const fetchUserData = async (userId) => {
  try {
    const docRef = doc(db, "Users_Abap", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      updateUIWithUserData(userData);
    } else {
      console.log("No document found matching user ID");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
};

const updateUIWithUserData = (userData) => {
  document.getElementById('loggedUserFName').innerText = userData.firstName;
  document.getElementById('loggedUserEmail').innerText = userData.email;
  document.getElementById('loggedUserLName').innerText = userData.lastName;
  document.getElementById('loggedUserMens').innerText = userData.saldo_mens;
 
  const profileAvatar = document.getElementById('profileAvatar');
  profileAvatar.innerHTML = userData.photo ? `<img src="${userData.photo}" width="40%" style="border-radius: 50%" alt="Avatar">` : '<i class="fas fa-user-circle"></i>';
};


const analyzePerformance = async (userId) => {
  try {
    const questionsText = await fetchQuestionData(userId);
    if (!questionsText) {
      alert("No questions available for analysis.");
      return;
    }

    const analysisText = await getAnalysisFromAI(questionsText);
    displayAnalysis(analysisText);
  } catch (error) {
    console.error("Error generating performance analysis:", error);
    alert("An error occurred while generating the performance analysis. Please try again.");
  }
};

const fetchQuestionData = async (userId) => {
  const subjectMap = {
"ABAP Basics": "abapBasics",
    "ABAP OO": "abapOO",
    "ABAP RICEFW": "abapRICEFW",
    "ABAP BOPF": "abapBOPF",
    "ABAP CRM": "abapCRM",
    "SAP FIORI": "sapFiori",
    "SAP PI-CPI": "sapPICPI",
    "SAP BTP": "sapBTP",
    "ABAP CDS Views": "abapCDSViews",
    "SAP HANA Modeling": "sapHANAModeling",
    "ABAP RAP": "abapRAP",
    "SAP BW/4HANA": "sapBW4HANA",
    "SAP S/4HANA Migration": "sapS4HANAMigration"
  };

  let questionsText = "";

  for (const [subjectName, firestoreField] of Object.entries(subjectMap)) {
    const subjectDocRef = doc(db, "Users_Abap", userId, "AbapData", firestoreField);
    const subjectDocSnap = await getDoc(subjectDocRef);

    if (subjectDocSnap.exists()) {
      const data = subjectDocSnap.data();
      questionsText += processSubjectData(data, subjectName);
    } else {
      console.log(`Document for ${subjectName} not found. Skipping this subject.`);
    }
  }

  return questionsText.trim();
};

const processSubjectData = (data, subjectName) => {
  let text = `${subjectName}:\n`;
  const questions = data.questoes || [];

  questions.forEach(question => {
    const { enunciado, alternativas, correta, errada } = question;
    text += `Question: ${enunciado}\n`;
    text += `Alternatives: ${Object.entries(alternativas).map(([key, value]) => `${key}: ${value}`).join(", ")}\n`;
    text += `Correct answer: ${correta}, Incorrect answer: ${errada}\n\n`;
  });

  text += `Total Correct Answers: ${data.totalCorretas || 0}\n`;
  text += `Total Incorrect Answers: ${data.totalErradas || 0}\n\n`;

  return text;
};

const getAnalysisFromAI = async (questionsText) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Analyze the performance in the following questions: ${questionsText}`
        }
      ],
      max_tokens: 1500,
      temperature: 0.5
    })
  });

  if (!response.ok) {
    throw new Error("Failed to generate performance analysis");
  }

  const analysis = await response.json();
  return analysis.choices[0].message.content;
};

const displayAnalysis = (analysisText) => {
  const analysisContent = document.getElementById('analysisContent');
  const modal = document.getElementById('analysisModal');

  if (analysisContent && modal) {
    analysisContent.innerHTML = `<p>${analysisText.replace(/\n/g, "<br>")}</p>`;
    modal.style.display = "block";
  } else {
    console.error("Modal elements not found.");
    alert("Internal error: unable to display the analysis.");
  }
};


const setupEventListeners = () => {
  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }

  const analyzeBtn = document.getElementById('analyzeBtn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      const user = auth.currentUser;
      if (user) {
        analyzePerformance(user.uid);
      } else {
        alert("User is not logged in.");
      }
    });
  }

  setupFooterLinks();
  setupModalClose();
};

const handleLogout = () => {
  localStorage.removeItem('loggedInUserId');
  signOut(auth)
    .then(() => {
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error('Error signing out:', error);
    });
};

const setupFooterLinks = () => {
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
};

const setupModalClose = () => {
  const closeBtn = document.querySelector('.close');
  if (closeBtn) {
    closeBtn.onclick = function() {
      document.getElementById('analysisModal').style.display = "none";
    }
  }

  window.onclick = function(event) {
    const modal = document.getElementById('analysisModal');
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
};

async function loadAndDisplayChart(userId) {
  console.log("Starting loadAndDisplayChart for userId:", userId);
  const subjectMap = {
"ABAP Basics": "abapBasics",
    "ABAP OO": "abapOO",
    "ABAP RICEFW": "abapRICEFW",
    "ABAP BOPF": "abapBOPF",
    "ABAP CRM": "abapCRM",
    "SAP FIORI": "sapFiori",
    "SAP PI-CPI": "sapPICPI",
    "SAP BTP": "sapBTP",
    "ABAP CDS Views": "abapCDSViews",
    "SAP HANA Modeling": "sapHANAModeling",
    "ABAP RAP": "abapRAP",
    "SAP BW/4HANA": "sapBW4HANA",
    "SAP S/4HANA Migration": "sapS4HANAMigration"
  };

  const chartData = {
    labels: Object.keys(subjectMap),
    datasets: [
      {
        label: 'Correct',
        data: [],
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
      },
      {
        label: 'Incorrect',
        data: [],
        backgroundColor: 'rgba(244, 67, 54, 0.8)',
      }
    ]
  };
  
  let hasData = false;
  try {
    for (const [subjectName, field] of Object.entries(subjectMap)) {
      console.log(`Fetching data for ${subjectName}`);
      const docRef = doc(db, "Users_Abap", userId, "AbapData", field);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(`Raw data for ${subjectName}:`, data);
        
        let totalCorrect = 0;
        let totalIncorrect = 0;

        // Process each question in the array
        data.questoes?.forEach(question => {
          console.log(`Processing question:`, question);
          if (isCorrect(question.correta)) {
            totalCorrect++;
          } else if (isCorrect(question.errada)) {
            totalIncorrect++;
          }
        });
        
        console.log(`${subjectName}: Correct = ${totalCorrect}, Incorrect = ${totalIncorrect}, Total = ${data.questoes?.length || 0}`);
        
        chartData.datasets[0].data.push(totalCorrect);
        chartData.datasets[1].data.push(totalIncorrect);
        
        if (totalCorrect > 0 || totalIncorrect > 0) hasData = true;
      } else {
        console.log(`Data not found for ${subjectName}`);
        chartData.datasets[0].data.push(0);
        chartData.datasets[1].data.push(0);
      }
    }

    console.log("Final chart data:", chartData);

    if (!hasData) {
      console.log("No valid data found to display on the chart.");
      return;
    }
    
    const ctx = document.getElementById('scoreChart')?.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          }
        }
      });
    } else {
      console.error("Element 'scoreChart' not found");
    }
    
    const ctxQuizzes = document.getElementById('exercisesChart')?.getContext('2d');
    if (ctxQuizzes) {
      const exercisesChart = new Chart(ctxQuizzes, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          }
        }
      });
    } else {
      console.error("Element 'exercisesChart' not found");
    }
  } catch (error) {
    console.error("Error loading and displaying the chart:", error);
  }
}  


// Helper function to check if a response is correct
function isCorrect(value) {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  return !!value; // Converts to boolean
}

// Function to initialize user data
async function initializeUserData(user) {
  if (user) {
    try {
      await fetchUserData(user.uid);
      await Promise.all([loadAndDisplayChart(user.uid)]);
    } catch (error) {
      console.error("Error initializing user data:", error);
    }
  } else {
    console.log("No authenticated user");
    window.location.href = 'index.html';
    // Redirect to login page or show appropriate message
  }
}



// Main initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded event triggered");
  console.log("Chart.js available:", typeof Chart !== 'undefined');

  if (typeof Chart === 'undefined') {
    console.error("Chart.js is not loaded. Check if the library is included correctly.");
    return;
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Authenticated user:", user.uid);
      initializeUserData(user);
    } else {
      console.log("No authenticated user");
      window.location.href = 'index.html';
      // Here you can add logic to redirect to the login page
    }
    setupEventListeners();
  });
});
