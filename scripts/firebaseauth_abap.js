// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwNC4QWaBQYqvayl98oMArcGdYV0JuqSk",
  authDomain: "elearning-568mbq.firebaseapp.com",
  projectId: "elearning-568mbq",
  storageBucket: "elearning-568mbq.appspot.com",
  messagingSenderId: "956581108104",
  appId: "1:956581108104:web:2be9a9b0c5978cd4b3823d",
  measurementId: "G-WLB4FBXE9R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', async (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const currentDate = new Date();
    const userData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      photo: "",
      message_balance: 30,
      remainingMessages: 30,
      lastMessageDate: currentDate.toISOString(),
    };

    const docRef = doc(db, "Users", user.uid);
    await setDoc(docRef, userData);

    const abapDataRef = collection(docRef, "ABAPData");
    await addDoc(abapDataRef, {
      abapBasics: { correct: 0, incorrect: 0 },
      abapOO: { correct: 0, incorrect: 0 },
      abapRICEFW: { correct: 0, incorrect: 0 },
      abapBOPF: { correct: 0, incorrect: 0 },
      abapCRM: { correct: 0, incorrect: 0 },
      sapFiori: { correct: 0, incorrect: 0 },
      sapPICPI: { correct: 0, incorrect: 0 },
      sapBTP: { correct: 0, incorrect: 0 },
      abapCDSViews: { correct: 0, incorrect: 0 },
      sapHANAModeling: { correct: 0, incorrect: 0 },
      abapRAP: { correct: 0, incorrect: 0 },
      sapBW4HANA: { correct: 0, incorrect: 0 },
      sapS4HANAMigration: { correct: 0, incorrect: 0 },
    });

    showMessage('Account Created Successfully', 'signUpMessage');
    window.location.href = 'index.html';
  } catch (error) {
    const errorCode = error.code;
    if (errorCode === 'auth/email-already-in-use') {
      showMessage('Email Address Already Exists!', 'signUpMessage');
    } else {
      showMessage('Unable to create User', 'signUpMessage');
    }
    console.error("Error creating user:", error);
  }
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    showMessage('Login successful', 'signInMessage');
    localStorage.setItem('loggedInUserId', user.uid);
    window.location.href = 'homepage.html';
  } catch (error) {
    const errorCode = error.code;
    if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
      showMessage('Incorrect Email or Password', 'signInMessage');
    } else {
      showMessage('Error signing in', 'signInMessage');
    }
    console.error("Error signing in:", error);
  }
});

document.getElementById('resetPasswordLink').addEventListener('click', (event) => {
  event.preventDefault(); // Prevents the link from executing its default navigation action
  document.getElementById('resetPasswordForm').style.display = 'block'; // Shows the password reset div
});

// Add Password Reset Functionality
const resetPassword = document.getElementById('resetPassword');
resetPassword.addEventListener('click', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;

  try {
    await sendPasswordResetEmail(auth, email);
    showMessage('Password reset email sent! Please check your inbox.', 'resetMessage');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    showMessage(`Error: ${error.message}`, 'resetMessage');
  }
});