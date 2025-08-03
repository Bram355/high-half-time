import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBr_iWxikkhtC6LHASLzVXVU7LNzB-DMc",
  authDomain: "high-half-time.firebaseapp.com",
  projectId: "high-half-time",
  storageBucket: "high-half-time.appspot.com",
  messagingSenderId: "801478278883",
  appId: "1:801478278883:web:e8c404a495fb40dc594fd6",
  measurementId: "G-4XK92WK42Y"
};

const app = initializeApp(firebaseConfig);

// ✅ Initialize both Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
