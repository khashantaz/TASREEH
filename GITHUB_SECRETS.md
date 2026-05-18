// ============================================================
// TASREEH — Firestore Security Rules
// File: firestore.rules
//
// Deploy with: firebase deploy --only firestore:rules
// Or paste directly into Firebase Console →
//   Firestore → Rules tab
// ============================================================

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── CLIENTS ──
    // Each client can only read/write their own profile
    match /clients/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;

      // Prevent clients from elevating their own plan
      allow update: if request.auth.uid == userId
                    && !("plan"  in request.resource.data.diff(resource.data).affectedKeys())
                    && !("quota" in request.resource.data.diff(resource.data).affectedKeys());
    }

    // ── TRANSACTIONS ──
    // Clients can read/create their own transactions; they cannot delete
    match /transactions/{txId} {
      allow read:   if request.auth != null
                    && resource.data.clientId == request.auth.uid;

      allow create: if request.auth != null
                    && request.resource.data.clientId == request.auth.uid
                    && request.resource.data.keys().hasAll(["clientId","type","workerName","status"]);

      // Clients can update non-sensitive fields only
      allow update: if request.auth != null
                    && resource.data.clientId == request.auth.uid
                    && !("clientId" in request.resource.data.diff(resource.data).affectedKeys())
                    && !("status"   in request.resource.data.diff(resource.data).affectedKeys());

      // Only server (admin SDK) can delete transactions
      allow delete: if false;
    }

    // ── DOCUMENTS / FILE UPLOADS ──
    match /documents/{docId} {
      allow read:  if request.auth != null
                   && resource.data.clientId == request.auth.uid;
      allow create: if request.auth != null
                    && request.resource.data.clientId == request.auth.uid;
      allow update, delete: if false;
    }

    // Block everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
