// Importando os módulos do Firebase necessários
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, collection, addDoc,  updateDoc, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDwNC4QWaBQYqvayl98oMArcGdYV0JuqSk",
  authDomain: "elearning-568mbq.firebaseapp.com",
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
                console.log('User not authenticated, redirect to login.');
                window.location.href = '/index.html';
                reject(new Error('User not authenticated.'));
            } else {
                console.log('Usuário autenticado:', user.uid);
                resolve(user.uid);
            }
        });
    });
}

export async function checkSaldoMensagens(userId) {
    try {
       
        const docRef = doc(db, "Users_Abap", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            const saldoMensagens = userData.saldo_mens|| 0;
            const lastMessageDateStr = userData.lastMessageDate; // A data armazenada como string

            const today = new Date();
            let lastMessageDate = lastMessageDateStr ? new Date(lastMessageDateStr) : null;

            // Verifica se o último acesso foi em um dia diferente
            const isNewDay = lastMessageDate ? (today.getDate() !== lastMessageDate.getDate() || today.getMonth() !== lastMessageDate.getMonth() || today.getFullYear() !== lastMessageDate.getFullYear()) : true;

            if (isNewDay) {
                // Se é um novo dia, restaura o saldo e atualiza a data
                const updatedSaldo = 30; // Por exemplo, o saldo diário é 10
                await updateDoc(docRef, {
                    saldo_mens: updatedSaldo,
                    lastMessageDate: today.toISOString() // Armazena como string novamente
                });
                return true;
            } else if (saldoMensagens <= 0) {
                alert('Você atingiu o limite diário de mensagens.');
                return false;
            } else {
                // Subtrai 1 do saldo e atualiza o documento
                await updateDoc(docRef, {
                    saldo_mens: saldoMensagens - 1
                });
                return true;
            }
        } else {
            alert('Usuário não encontrado.');
            return false;
        }
    } catch (error) {
        //console.error("Erro ao verificar o saldo de mensagens: " + error.message);
       // throw new Error("Erro ao verificar o saldo de mensagens: " + error.message);
        return false;
    }
}

// Mapeamento de subjects para IDs de documentos corretos
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
}
;

// Função para buscar ou criar o ID da subcoleção
async function getOrCreateSubCollectionId(userId) {
    // Referência ao documento do usuário
    const userDocRef = doc(db, "Users_Abap", userId);
    const userDocSnap = await getDoc(userDocRef);

    let subCollectionId;

    if (userDocSnap.exists()) {
        // Verifica se o ID da subcoleção já está armazenado no documento do usuário
        subCollectionId = userDocSnap.data().currentSubCollectionId;

        if (!subCollectionId) {
            // Se o ID não estiver presente, gera um novo ID e o armazena
            subCollectionId = `${userId}_${new Date().getTime()}`;
            await updateDoc(userDocRef, {
                currentSubCollectionId: subCollectionId
            });
        }
    } else {
        // Caso o documento do usuário não exista, cria o documento e define o ID da subcoleção
        subCollectionId = `${userId}_${new Date().getTime()}`;
        await setDoc(userDocRef, {
            currentSubCollectionId: subCollectionId
        });
    }

    return subCollectionId;
}

// Função para concatenar o texto existente com o novo texto, separados por "//"
function incrementText(existingText, newText) {
    if (existingText) {
        return `${existingText} // ${newText}`;
    }
    return newText;
}

export async function saveSimuladoResult(userId, subject, questions, correctAnswers, wrongAnswers) {
    try {
        const subjectId = subjectMap[subject];

        if (!subjectId) {
            console.error(`Subject not found in the mapping: ${subject}`);
            return;
        }

       // Garante que correctAnswers e wrongAnswers sejam números
        correctAnswers = Number(correctAnswers) || 0;
        wrongAnswers = Number(wrongAnswers) || 0;

        // Referência ao documento dentro da subcoleção "EnemData"
        const subjectDocRef = doc(db, "Users_Abap", userId, "AbapData", subjectId);

        // Tenta recuperar o documento existente
        const docSnapshot = await getDoc(subjectDocRef);

        let updatedQuestoes;

        if (docSnapshot.exists()) {
            const currentData = docSnapshot.data();

            // Verifica se currentData.questoes está definido e é um array, senão inicializa como array vazio
            const previousQuestoes = Array.isArray(currentData.questoes) ? currentData.questoes : [];
           
            updatedQuestoes = previousQuestoes.concat(questions);

            // Atualiza o documento existente com as novas questões e total de corretas/erradas
            await updateDoc(subjectDocRef, {
                questoes: updatedQuestoes,
                totalCorretas: (currentData.totalCorretas || 0) + correctAnswers,
                totalErradas: (currentData.totalErradas || 0) + wrongAnswers
            });

            console.log(`Resultado atualizado para a matéria: ${subjectId}`);
        } else {
            // Se o documento não existir, cria um novo com as questões e os contadores de acertos/erros
            updatedQuestoes = questions;
            await setDoc(subjectDocRef, {
                questoes: updatedQuestoes,
                totalCorretas: correctAnswers,
                totalErradas: wrongAnswers
            });

            console.log(`Documento criado e resultado salvo para a matéria: ${subjectId}`);
        }

    } catch (error) {
        console.error("Error saving simulated exam result in Firestore: ", error);
    }
}



