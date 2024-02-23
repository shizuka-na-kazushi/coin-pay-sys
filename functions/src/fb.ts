

// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

export const app = initializeApp();
export const db = getDatabase(app);

