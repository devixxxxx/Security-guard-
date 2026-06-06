import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDYwnuQSZXkzcihYMl6idlwHHRXjXqhU_s",
  authDomain: "security-guard-91aff.firebaseapp.com",
  databaseURL: "https://security-guard-91aff-default-rtdb.firebaseio.com",
  projectId: "security-guard-91aff",
  storageBucket: "security-guard-91aff.firebasestorage.app",
  messagingSenderId: "492756741883",
  appId: "1:492756741883:web:b287dfcac8d94abeef0a5e",
  measurementId: "G-6XXPH9C3RK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
