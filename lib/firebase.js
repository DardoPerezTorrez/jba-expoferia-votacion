// /lib/firebase.js

// Importa las funciones necesarias
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- Importa Firestore

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHLW06x8jZdmdppDfnKCsSYj-8lvcYkKY",
  authDomain: "jba-votacion.firebaseapp.com",
  projectId: "jba-votacion",
  storageBucket: "jba-votacion.firebasestorage.app",
  messagingSenderId: "356730244823",
  appId: "1:356730244823:web:6e537a1e30370f88a1aa92"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa y exporta la base de datos Firestore
export const db = getFirestore(app); // <-- Exportamos la instancia de Firestore

// ¡Ahora 'db' está disponible para usar en tus API routes y componentes de servidor!