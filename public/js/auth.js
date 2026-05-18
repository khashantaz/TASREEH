// ============================================================
// TASREEH — Authentication Module
// File: public/js/auth.js
//
// Handles: login, register, logout, password reset,
//          Google sign-in, session state, email verification
// ============================================================

import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ─────────────────────────────────────────────
// REGISTER NEW CLIENT
// ─────────────────────────────────────────────
export async function registerClient({ firstName, lastName, company, companyType, email, password }) {
  // 1. Create Firebase Auth user
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // 2. Set display name
  await updateProfile(user, { displayName: `${firstName} ${lastName}` });

  // 3. Send email verification
  await sendEmailVerification(user, {
    url: "https://tasreeh.co.uk/dashboard"
  });

  // 4. Create client document in Firestore
  await setDoc(doc(db, "clients", user.uid), {
    uid:         user.uid,
    firstName,
    lastName,
    fullName:    `${firstName} ${lastName}`,
    company,
    companyType,
    email,
    plan:        "basic",           // default plan on signup
    quota: {
      used:  0,
      total: 5                      // basic plan = 5 tx/month
    },
    verified:    false,
    status:      "active",
    createdAt:   serverTimestamp(),
    updatedAt:   serverTimestamp()
  });

  return user;
}

// ─────────────────────────────────────────────
// LOGIN WITH EMAIL + PASSWORD
// ─────────────────────────────────────────────
export async function loginClient(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// ─────────────────────────────────────────────
// GOOGLE SIGN-IN
// ─────────────────────────────────────────────
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const credential = await signInWithPopup(auth, provider);
  const user = credential.user;

  // Check if first time Google login → create profile
  const clientRef = doc(db, "clients", user.uid);
  const existing  = await getDoc(clientRef);

  if (!existing.exists()) {
    const nameParts = (user.displayName || "").split(" ");
    await setDoc(clientRef, {
      uid:         user.uid,
      firstName:   nameParts[0] || "",
      lastName:    nameParts.slice(1).join(" ") || "",
      fullName:    user.displayName || "",
      company:     "",
      companyType: "",
      email:       user.email,
      plan:        "basic",
      quota:       { used: 0, total: 5 },
      verified:    user.emailVerified,
      status:      "active",
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp()
    });
  }

  return user;
}

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────
export async function logoutClient() {
  await signOut(auth);
  window.location.href = "/";
}

// ─────────────────────────────────────────────
// PASSWORD RESET
// ─────────────────────────────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email, {
    url: "https://tasreeh.co.uk/login"
  });
}

// ─────────────────────────────────────────────
// GET CURRENT CLIENT PROFILE FROM FIRESTORE
// ─────────────────────────────────────────────
export async function getClientProfile(uid) {
  const snap = await getDoc(doc(db, "clients", uid));
  if (snap.exists()) return snap.data();
  return null;
}

// ─────────────────────────────────────────────
// SESSION GUARD — protect dashboard pages
// Call this at the top of any protected page.
// Redirects to / if no user is logged in.
// ─────────────────────────────────────────────
export function requireAuth(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "/";
      return;
    }
    const profile = await getClientProfile(user.uid);
    if (callback) callback(user, profile);
  });
}

// ─────────────────────────────────────────────
// TRANSLATE FIREBASE ERROR CODES → Arabic/English
// ─────────────────────────────────────────────
export function translateAuthError(code) {
  const errors = {
    "auth/user-not-found":        "البريد الإلكتروني غير مسجل / Email not found",
    "auth/wrong-password":        "كلمة المرور غير صحيحة / Wrong password",
    "auth/email-already-in-use":  "البريد الإلكتروني مسجل مسبقاً / Email already registered",
    "auth/weak-password":         "كلمة المرور قصيرة جداً (8 أحرف على الأقل) / Password too short",
    "auth/invalid-email":         "صيغة البريد الإلكتروني غير صحيحة / Invalid email format",
    "auth/too-many-requests":     "تم تجاوز عدد المحاولات، حاول لاحقاً / Too many attempts",
    "auth/popup-closed-by-user":  "تم إغلاق نافذة تسجيل الدخول / Popup closed",
    "auth/network-request-failed":"خطأ في الاتصال بالإنترنت / Network error"
  };
  return errors[code] || `حدث خطأ غير متوقع (${code}) / Unexpected error`;
}
