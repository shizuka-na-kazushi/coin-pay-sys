
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FB_DATABASE_URL, 
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getDatabase(firebaseApp);
export const functions = getFunctions(firebaseApp);

export const isOnLocalhost = () => (location.hostname === 'localhost' || location.hostname === '127.0.0.1');

const location: Location = window.location;

// for emulation 
if (isOnLocalhost()) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectDatabaseEmulator(db, 'localhost', 9000);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

