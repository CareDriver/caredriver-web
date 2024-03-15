import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA59UUgknX3dx5_S-3pmBjafe-ogxSAzNE",
    authDomain: "caredriver-61ac3.firebaseapp.com",
    projectId: "caredriver-61ac3",
    storageBucket: "caredriver-61ac3.appspot.com",
    messagingSenderId: "331188920579",
    appId: "1:331188920579:web:bc38df57aa0b2c733f0936",
    measurementId: "G-163WQGJ4V8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
