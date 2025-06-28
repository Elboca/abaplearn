// Importing the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, collection, addDoc, updateDoc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

console.log('Firebase initialized:', app);
// Function to check if the page is accessed via Android WebView
//function isAndroidWebView() {
  // Using Option 2: Checking for the injected variable
 // return window.isAndroidWebView === true;
}

// Corrected checkAuthState function
export async function checkAuthState() {
  return new Promise((resolve, reject) => {
    const user = auth.currentUser;
    if (!user) {
      console.log('User not authenticated, redirecting to login.');
      window.location.href = '/index.html';
      reject(new Error('User not authenticated.'));
    } else if (!isAndroidWebView()) {
     // console.log('Accessing outside of Android WebView, redirecting.');
    //  window.location.href = '/index.html';
    //  reject(new Error('Accessing outside of Android WebView.'));
    } else {
    //  console.log('User authenticated:', user.uid);
    //  resolve(user.uid);
    }
  });
}

// On page load, check authentication state
document.addEventListener('DOMContentLoaded', () => {
  checkAuthState()
    .then((userId) => {
      // Initialize user data and other functionalities
      initializeUserData(userId);
    })
    .catch((error) => {
      console.error('Initialization failed:', error);
      // Additional error handling if needed
    });
});



export async function checkMessageBalance(userId) {
    try {
        const docRef = doc(db, "Users_ABAP", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            const messageBalance = userData.messageBalance || 0;
            const lastMessageDateStr = userData.lastMessageDate; // Date stored as a string

            const today = new Date();
            let lastMessageDate = lastMessageDateStr ? new Date(lastMessageDateStr) : null;

            // Check if the last access was on a different day
            const isNewDay = lastMessageDate ? (today.getDate() !== lastMessageDate.getDate() || today.getMonth() !== lastMessageDate.getMonth() || today.getFullYear() !== lastMessageDate.getFullYear()) : true;

            if (isNewDay) {
                // If it's a new day, reset the balance and update the date
                const updatedBalance = 50; // For example, the daily balance is 50
                await updateDoc(docRef, {
                    messageBalance: updatedBalance,
                    lastMessageDate: today.toISOString() // Store as string again
                });
                return true;
            } else if (messageBalance <= 0) {
                alert('You have reached the daily message limit.');
                return false;
            } else {
                // Subtract 1 from the balance and update the document
                await updateDoc(docRef, {
                    messageBalance: messageBalance - 1
                });
                return true;
            }
        } else {
            alert('User not found.');
            return false;
        }
    } catch (error) {
        return false;
    }
}


// Mapping of subjects to correct document IDs
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

// Function to retrieve or create the subcollection ID
async function getOrCreateSubCollectionId(userId) {
    // Reference to the user's document
    const userDocRef = doc(db, "Users_ABAP", userId);
    const userDocSnap = await getDoc(userDocRef);

    let subCollectionId;

    if (userDocSnap.exists()) {
        // Check if the subcollection ID is already stored in the user's document
        subCollectionId = userDocSnap.data().currentSubCollectionId;

        if (!subCollectionId) {
            // If the ID is not present, generate a new ID and store it
            subCollectionId = `${userId}_${new Date().getTime()}`;
            await updateDoc(userDocRef, {
                currentSubCollectionId: subCollectionId
            });
        }
    } else {
        // If the user's document doesn't exist, create the document and set the subcollection ID
        subCollectionId = `${userId}_${new Date().getTime()}`;
        await setDoc(userDocRef, {
            currentSubCollectionId: subCollectionId
        });
    }

    return subCollectionId;
}

// Function to concatenate existing text with new text, separated by "//"
function incrementText(existingText, newText) {
    if (existingText) {
        return `${existingText} // ${newText}`;
    }
    return newText;
}

export async function saveSimulatedExamResult(userId, subject, questions, correctAnswers, wrongAnswers) {
    try {
        const subjectId = subjectMap[subject];

        if (!subjectId) {
            console.error(`Subject not found in the mapping: ${subject}`);
            return;
        }

        // Ensure correctAnswers and wrongAnswers are numbers
        correctAnswers = Number(correctAnswers) || 0;
        wrongAnswers = Number(wrongAnswers) || 0;

        // Reference to the document inside the "AbapData" subcollection
        const subjectDocRef = doc(db, "Users_ABAP", userId, "AbapData", subjectId);

        // Try to retrieve the existing document
        const docSnapshot = await getDoc(subjectDocRef);

        let updatedQuestions;

        if (docSnapshot.exists()) {
            // If the document exists, concatenate the new text with the existing one
            const existingData = docSnapshot.data();
            updatedQuestions = incrementText(existingData.questions, questions);

            await updateDoc(subjectDocRef, {
                correctAnswers: increment(correctAnswers),
                wrongAnswers: increment(wrongAnswers),
                questions: updatedQuestions
            });
        } else {
            // If the document doesn't exist, create it with the initial data
            updatedQuestions = questions;

            await setDoc(subjectDocRef, {
                correctAnswers,
                wrongAnswers,
                questions: updatedQuestions
            });
        }

        console.log("Simulated exam result successfully saved in Firestore.");
    } catch (error) {
        console.error("Error saving simulated exam result in Firestore:", error);
    }
}

