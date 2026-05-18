// ============================================================
// TASREEH — Firebase Configuration
// File: public/js/firebase-config.js
//
// SETUP: Replace the values below with your actual Firebase
// project config from:
// console.firebase.google.com → Project Settings → Your Apps
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyC2VqjbHdYQPm9B0Sa9GvgVgeRbOs63AEI",
  authDomain:        "tasreeh-prod.firebaseapp.com",
  projectId:         "tasreeh-prod",
  storageBucket:     "tasreeh-prod.appspot.com",
  messagingSenderId: "98590606477",
  appId:             "1:98590606477:web:0bb5c52d8232ff85658ec4"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export { app, auth, db };
