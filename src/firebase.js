import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDluA1iKHu1-qAlgRibqdUK1maMjPUqMCs",
  authDomain: "fabulosa-chat.firebaseapp.com",
  projectId: "fabulosa-chat",
  storageBucket: "fabulosa-chat.firebasestorage.app",
  messagingSenderId: "394855706516",
  appId: "1:394855706516:web:50d94f0c6647714e6f2981"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);