// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup  } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
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
      saldo_mens: 30,
      mensagensRest: 30,
      lastMessageDate: currentDate.toISOString(),
    };

    const docRef = doc(db, "Users_Abap", user.uid);
    await setDoc(docRef, userData);

    const enemDataRef = collection(docRef, "AbapData");
    await addDoc(enemDataRef, {
 "ABAP Basics": { "corrects": 0, "incorrect": 0 },
"ABAP OO": { "corrects": 0, "incorrect": 0 },
"ABAP RICEFW": { "corrects": 0, "incorrect": 0 },
"ABAP BOPF": { "corrects": 0, "incorrect": 0 },
"ABAP CRM": { "corrects": 0, "incorrect": 0 },
"SAP Fiori": { "corrects": 0, "incorrect": 0 },
"SAP PI/CPI": { "corrects": 0, "incorrect": 0 },
"SAP BTP": { "corrects": 0, "incorrect": 0 },
"ABAP CDS Views": { "corrects": 0, "incorrect": 0 },
"SAP HANA Modeling": { "corrects": 0, "incorrect": 0 },
"ABAP RAP": { "corrects": 0, "incorrect": 0 },
"SAP BW/4HANA": { "corrects": 0, "incorrect": 0 },
"SAP S/4HANA Migration": { "corrects": 0, "incorrect": 0 }


    });

    showMessage('Account Created Successfully', 'signUpMessage');
    window.location.href = 'index.html';
  } catch (error) {
    const errorCode = error.code;
    if (errorCode === 'auth/email-already-in-use') {
      showMessage('Email Address Already Exists !!!', 'signUpMessage');
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
    showMessage('Login is successful', 'signInMessage');
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
  event.preventDefault(); // Evita que o link execute sua ação padrão de navegação
  document.getElementById('resetPasswordForm').style.display = 'block'; // Mostra o div de redefinição de senha
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


document.addEventListener('DOMContentLoaded', function () {
    const guestLoginButton = document.getElementById('guestLoginButton');
    if (guestLoginButton) {
        guestLoginButton.addEventListener('click', function () {
            console.log("Guest Login button clicked");

            // User and password for guest login (pre-created)
            const guestEmail = "guest@example.com";
            const guestPassword = "passoed123";

            // Call the Firebase Authentication login function
            signInWithEmailAndPassword(auth, guestEmail, guestPassword)
                .then((userCredential) => {
                    // Successful login
                    console.log("Guest login successful!");
                    window.location.href = 'homepage.html'; // Redirect after successful login
                })
                .catch((error) => {
                    // Error handling during login
                    console.error("Error during guest login:", error.message);
                    alert("Error during guest login. Please try again later.");
                });
        });
    }
});

