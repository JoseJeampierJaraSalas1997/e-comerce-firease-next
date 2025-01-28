import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIHthUwvO_jQE230KO-oQhuNcs7_GsRxo",
  authDomain: "ecomerce-backend-218f4.firebaseapp.com",
  projectId: "ecomerce-backend-218f4",
  storageBucket: "ecomerce-backend-218f4.firebasestorage.app",
  messagingSenderId: "440268610671",
  appId: "1:440268610671:web:748dc9da23236516ca019a",
  measurementId: "G-E52SS7Z2ER",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Configurar Firestore
export const db = getFirestore(app);
