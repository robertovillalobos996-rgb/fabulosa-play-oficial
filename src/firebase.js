// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importamos la base de datos

const firebaseConfig = {
  apiKey: "AIzaSyDluA1iKHu1-qAlgRibqdUK1maMjPUqMCs",
  authDomain: "fabulosa-chat.firebaseapp.com",
  projectId: "fabulosa-chat",
  storageBucket: "fabulosa-chat.firebasestorage.app",
  messagingSenderId: "394855706516",
  appId: "1:394855706516:web:50d94f0c6647714e6f2981"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
// Exportamos la base de datos para usarla en el chat
export const db = getFirestore(app);