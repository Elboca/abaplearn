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
    const docRef = doc(db, "Users_Finn", userId);
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

const updateUIWithUserData = (userData) => {
  document.getElementById('loggedUserFName').innerText = userData.firstName;
  document.getElementById('loggedUserEmail').innerText = userData.email;
  document.getElementById('loggedUserLName').innerText = userData.lastName;
  document.getElementById('loggedUserMens').innerText = userData.saldo_mens;

  const profileAvatar = document.getElementById('profileAvatar');
  profileAvatar.innerHTML = userData.photo ? `<img src="${userData.photo}" width="40%" style="border-radius: 50%" alt="Avatar">` : '<i class="fas fa-user-circle"></i>';
};

const fetchQuestionData = async (userId) => {
  const subjectMap = {
    "SAP S/4HANA Universal Journal": "sapUniversalJournal",
    "Business Partner in SAP S/4HANA": "sapBusinessPartner",
    "Material Ledger in SAP S/4HANA": "sapMaterialLedger",
    "Financial Closing in SAP S/4HANA": "sapFinancialClosing",
    "Treasury and Risk Management in SAP S/4HANA": "sapTreasuryRiskManagement",
    "SAP Central Finance": "sapCentralFinance",
    "New General Ledger in SAP S/4HANA": "sapNewGL",
    "SAP Group Reporting": "sapGroupReporting",
    "SAP Analytics Cloud Integration": "sapAnalyticsCloud",
    "Revenue Accounting and Reporting (RAR)": "sapRAR",
    "Extended Warehouse Management (EWM)": "sapEWM",
    "Credit Management in SAP S/4HANA": "sapCreditManagement",
    "Public Sector Management (PSM)": "sapPSM"
  };

  let questionsText = "";

  for (const [subjectName, firestoreField] of Object.entries(subjectMap)) {
    const subjectDocRef = doc(db, "Users_Finn", userId, "FinnData", firestoreField);
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
  const questoes = data.questoes || [];

  questoes.forEach(questao => {
    const { enunciado, alternativas, correta, errada } = questao;
    text += `Question: ${enunciado}\n`;
    text += `Alternatives: ${Object.entries(alternativas).map(([key, value]) => `${key}: ${value}`).join(", ")}\n`;
    text += `Correct answer: ${correta}, Wrong answer: ${errada}\n\n`;
  });

  text += `Total Correct Answers: ${data.totalCorretas || 0}\n`;
  text += `Total Wrong Answers: ${data.totalErradas || 0}\n\n`;

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
          content: `Analyze performance on the following questions: ${questionsText}`
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
    alert("Internal error: could not display analysis.");
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
    "SAP S/4HANA Universal Journal": "sapUniversalJournal",
    "Business Partner in SAP S/4HANA": "sapBusinessPartner",
    "Material Ledger in SAP S/4HANA": "sapMaterialLedger",
    "Financial Closing in SAP S/4HANA": "sapFinancialClosing",
    "Treasury and Risk Management in SAP S/4HANA": "sapTreasuryRiskManagement",
    "SAP Central Finance": "sapCentralFinance",
    "New General Ledger in SAP S/4HANA": "sapNewGL",
    "SAP Group Reporting": "sapGroupReporting",
    "SAP Analytics Cloud Integration": "sapAnalyticsCloud",
    "Revenue Accounting and Reporting (RAR)": "sapRAR",
    "Extended Warehouse Management (EWM)": "sapEWM",
    "Credit Management in SAP S/4HANA": "sapCreditManagement",
    "Public Sector Management (PSM)": "sapPSM"
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
        label: 'Wrong',
        data: [],
        backgroundColor: 'rgba(244, 67, 54, 0.8)',
      }
    ]
  };
  let hasData = false;
  try {
    for (const [subjectName, field] of Object.entries(subjectMap)) {
      console.log(`Fetching data for ${subjectName}`);
      const docRef = doc(db, "Users_Finn", userId, "FinnData", field);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(`Raw data for ${subjectName}:`, data);
        
        let totalCorretas = 0;
        let totalErradas = 0;

        // Process each question in the array
        data.questoes?.forEach(questao => {
          console.log(`Processing question:`, questao);
          if (isCorrect(questao.correta)) {
            totalCorretas++;
          } else if (isCorrect(questao.errada)) {
            totalErradas++;
          }
        });
        
        console.log(`${subjectName}: Correct = ${totalCorretas}, Wrong = ${totalErradas}, Total = ${data.questoes?.length || 0}`);
        
        chartData.datasets[0].data.push(totalCorretas);
        chartData.datasets[1].data.push(totalErradas);
        
        if (totalCorretas > 0 || totalErradas > 0) hasData = true;
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
    
    const ctx = document.getElementById('scoreChart');
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
  } catch (error) {
    console.error("Error loading and displaying the chart:", error);
  }
}

// Auxiliary function to check if an answer is correct
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
    // Redirect to login page or show appropriate message
     window.location.href = 'index.html';
  }
}

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded event triggered");
  console.log("Chart.js available:", typeof Chart !== 'undefined');

  if (typeof Chart === 'undefined') {
    console.error("Chart.js is not loaded. Please ensure the library is included correctly.");
    return;
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Authenticated user:", user.uid);
      initializeUserData(user);
    } else {
      console.log("No authenticated user");
      // Here you can add logic to redirect to the login page
       window.location.href = 'index.html';
    }
    setupEventListeners();
  });
});
