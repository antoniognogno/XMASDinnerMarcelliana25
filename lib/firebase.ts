import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Sostituisci questo oggetto con quello copiato da Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCq_AdQ2I0fiEb3VFhnFfHt5CT0Puz2koU",
  authDomain: "xmas-dinner-2025.firebaseapp.com",
  databaseURL: "https://xmas-dinner-2025-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "xmas-dinner-2025",
  storageBucket: "xmas-dinner-2025.firebasestorage.app",
  messagingSenderId: "352782144390",
  appId: "1:352782144390:web:c4c35dbadc9a52898c9207"
};

// Singleton pattern: se esiste già un'app, usa quella, altrimenti inizializza.
// Evita errori durante l'Hot Reload di Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { db };