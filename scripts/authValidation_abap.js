// Importando os módulos do Firebase necessários
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, collection, addDoc,  updateDoc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDwNC4QWaBQYqvayl98oMArcGdYV0JuqSk",
  authDomain: "elearning-568mbq.firebaseapp.com",
  databaseURL: "https://elearning-568mbq-default-rtdb.firebaseio.com",
  projectId: "elearning-568mbq",
  storageBucket: "elearning-568mbq.appspot.com",
  messagingSenderId: "956581108104",
  appId: "1:956581108104:web:2be9a9b0c5978cd4b3823d",
  measurementId: "G-WLB4FBXE9R"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('Firebase inicializado:', app);
export async function checkAuthState() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.log('Usuário não autenticado, redirecionando para login.');
                window.location.href = '/index.html';
                reject(new Error('Usuário não autenticado.'));
            } else {
                console.log('Usuário autenticado:', user.uid);
                resolve(user.uid);
            }
        });
    });
}
export async function checkMessageBalance(userId) {
    try {
        const docRef = doc(db, "Users", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const messageBalance = userData.message_balance || 0;
            const lastMessageDateStr = userData.lastMessageDate;
            const today = new Date();
            const lastMessageDate = lastMessageDateStr ? new Date(lastMessageDateStr) : null;

            // Check subscription status
            const hasActiveSubscription = await checkStripeSubscription(userData);

            if (hasActiveSubscription) {
                // If user has an active subscription, they have unlimited messages
                return true;
            }

            // Check if it's a new day
            const isNewDay = lastMessageDate ? 
                (today.getDate() !== lastMessageDate.getDate() ||
                 today.getMonth() !== lastMessageDate.getMonth() ||
                 today.getFullYear() !== lastMessageDate.getFullYear()) : true;

            if (isNewDay) {
                // If it's a new day, restore the balance and update the date
                const updatedBalance = 30; // Daily balance for non-subscribers
                await updateDoc(docRef, {
                    message_balance: updatedBalance,
                    lastMessageDate: today.toISOString()
                });
                return true;
            } else if (messageBalance <= 0) {
                alert('You have reached the daily message limit. Consider upgrading to a subscription for unlimited access.');
                return false;
            } else {
                // Subtract 1 from the balance and update the document
                await updateDoc(docRef, {
                    message_balance: messageBalance - 1
                });
                return true;
            }
        } else {
            alert('User not found.');
            return false;
        }
    } catch (error) {
        console.error("Error checking message balance: " + error.message);
        return false;
    }
}

async function checkStripeSubscription(userData) {
    // Check if user has a Stripe subscription
    if (!userData.stripeSubscription) {
        return false;
    }

    const { status, current_period_end } = userData.stripeSubscription;
    const now = new Date();
    const subscriptionEnd = new Date(current_period_end * 1000); // Convert UNIX timestamp to Date

    // Check if subscription is active and not expired
    return status === 'active' && subscriptionEnd > now;
}

export async function checkEssayBalance(userId) {
    try {
        const userRef = doc(db, "Users", userId);
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) {
            throw new Error("User document not found.");
        }
        
        const userData = userSnapshot.data();
        
        // Check if user has an active subscription
        const hasActiveSubscription = await checkStripeSubscription(userData);
        
        if (hasActiveSubscription) {
            // Subscribers have unlimited essay checks
            return true;
        }
        
        // For non-subscribers, implement your essay balance logic here
        // For example:
        const essayBalance = userData.essay_balance || 0;
        if (essayBalance > 0) {
            await updateDoc(userRef, {
                essay_balance: essayBalance - 1
            });
            return true;
        } else {
            alert('You have no more essay checks available. Consider upgrading to a subscription for unlimited access.');
            return false;
        }
    } catch (error) {
        console.error("Error checking essay balance: " + error.message);
        return false;
    }
}

/**
 * Salva o resultado da redação do ENEM no Firestore na subcoleção "EnemData".
 *
 * @param {string} userId - O ID do usuário autenticado.
 * @param {number} nota - A nota atribuída à redação pelo ChatGPT.
 * @param {string} feedback - O feedback detalhado fornecido pelo ChatGPT.
 * @param {string} userText - O texto da redação enviado pelo usuário.
 */


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

async function getOrCreateSubCollectionId(userId) {
    const userDocRef = doc(db, "Users", userId);
    const userDocSnap = await getDoc(userDocRef);
    let subCollectionId;
    if (userDocSnap.exists()) {
        subCollectionId = userDocSnap.data().currentABAPSubCollectionId;
        if (!subCollectionId) {
            subCollectionId = `ABAP_${userId}_${new Date().getTime()}`;
            await updateDoc(userDocRef, {
                currentABAPSubCollectionId: subCollectionId
            });
        }
    } else {
        subCollectionId = `ABAP_${userId}_${new Date().getTime()}`;
        await setDoc(userDocRef, {
            currentABAPSubCollectionId: subCollectionId
        });
    }
    return subCollectionId;
}

export async function saveABAPTestResult(userId, subject, questions, correctAnswers, wrongAnswers) {
    try {
        const subjectId = subjectMap[subject];
        if (!subjectId) {
            console.error(`Subject not found in ABAP mapping: ${subject}`);
            return;
        }

        correctAnswers = Number(correctAnswers) || 0;
        wrongAnswers = Number(wrongAnswers) || 0;

        const subCollectionId = await getOrCreateSubCollectionId(userId);
        const subjectDocRef = doc(db, "Users", userId, "ABAPLearning", subCollectionId, "Subjects", subjectId);

        const docSnapshot = await getDoc(subjectDocRef);
        let updatedData;

        if (docSnapshot.exists()) {
            const currentData = docSnapshot.data();
            updatedData = {
                questions: Array.isArray(currentData.questions) ? [...currentData.questions, ...questions] : questions,
                totalCorrect: (currentData.totalCorrect || 0) + correctAnswers,
                totalWrong: (currentData.totalWrong || 0) + wrongAnswers,
                lastUpdated: new Date().toISOString()
            };
            await updateDoc(subjectDocRef, updatedData);
            console.log(`Result updated for ABAP topic: ${subject}`);
        } else {
            updatedData = {
                questions: questions,
                totalCorrect: correctAnswers,
                totalWrong: wrongAnswers,
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            await setDoc(subjectDocRef, updatedData);
            console.log(`Document created and result saved for ABAP topic: ${subject}`);
        }
    } catch (error) {
        console.error("Error saving ABAP test result: ", error);
    }
}


