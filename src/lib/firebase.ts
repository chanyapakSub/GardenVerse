"use client";

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "placeholder",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gardenverse-a21d0.firebaseapp.com",
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    "https://gardenverse-a21d0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gardenverse-a21d0",
};

// Singleton — กัน init ซ้ำตอน HMR
const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const rtdb: Database = getDatabase(app);
