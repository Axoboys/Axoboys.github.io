// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAODYOz_M_CAr4ReMZzhMi71qU_DASgBls",
  authDomain: "axoclicker-24a88.firebaseapp.com",
  projectId: "axoclicker-24a88",
  storageBucket: "axoclicker-24a88.firebasestorage.app",
  messagingSenderId: "398089022766",
  appId: "1:398089022766:web:70f6c0f0d1fc4796abdebf"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);