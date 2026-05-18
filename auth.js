// ============================================================
// TASREEH — Stripe Webhook Handler
// File: api/stripe-webhook.js
//
// Listens for Stripe events and updates Firebase Firestore
// so the client dashboard reflects their active plan instantly.
//
// SETUP in Vercel Environment Variables:
//   STRIPE_SECRET_KEY        = sk_live_...
//   STRIPE_WEBHOOK_SECRET    = whsec_...  (from Stripe → Webhooks)
//   FIREBASE_PROJECT_ID      = tasreeh-prod
//   FIREBASE_CLIENT_EMAIL    = ...
//   FIREBASE_PRIVATE_KEY     = -----BEGIN PRIVATE KEY-----...
//
// Register webhook endpoint in Stripe dashboard:
//   URL: https://tasreeh.co.uk/api/stripe-webhook
//   Events: checkout.session.completed, customer.subscription.deleted,
//           invoice.payment_failed
// ============================================================

const stripe   = require("stripe")(process.env.STRIPE_SECRET_KEY);
const admin    = require("firebase-admin");

// Initialize Firebase Admin (server-side) once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
    })
  });
}

const db = admin.firestore();

// Plan quota mapping
const PLAN_QUOTAS = {
  basic:    { total: 5,  label: "الباقة الأساسية" },
  advanced: { total: 20, label: "الباقة المتقدمة" },
  per_tx:   { total: 1,  label: "دفع لكل معاملة"  }
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).end(); return; }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Stripe requires the raw body for signature verification
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log("Stripe event:", event.type);

  try {
    switch (event.type) {

      // ── SUCCESSFUL PAYMENT / NEW SUBSCRIPTION ──
      case "checkout.session.completed": {
        const session     = event.data.object;
        const firebaseUid = session.metadata?.firebase_uid;
        const plan        = session.metadata?.plan;
        if (!firebaseUid || !plan) break;

        const quota = PLAN_QUOTAS[plan] || PLAN_QUOTAS.basic;

        await db.doc(`clients/${firebaseUid}`).update({
          plan,
          planLabel:         quota.label,
          stripeCustomerId:  session.customer,
          stripeSessionId:   session.id,
          "quota.total":     quota.total,
          "quota.used":      0,
          subscriptionActive: true,
          updatedAt:          admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`Plan updated → ${firebaseUid}: ${plan}`);
        break;
      }

      // ── SUBSCRIPTION CANCELLED ──
      case "customer.subscription.deleted": {
        const sub         = event.data.object;
        const firebaseUid = sub.metadata?.firebase_uid;
        if (!firebaseUid) break;

        await db.doc(`clients/${firebaseUid}`).update({
          plan:               "basic",
          planLabel:          "الباقة الأساسية",
          "quota.total":      5,
          subscriptionActive: false,
          updatedAt:          admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`Subscription ended → ${firebaseUid}: downgraded to basic`);
        break;
      }

      // ── PAYMENT FAILED ──
      case "invoice.payment_failed": {
        const invoice     = event.data.object;
        const customerId  = invoice.customer;

        // Find client by Stripe customer ID
        const snap = await db.collection("clients")
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!snap.empty) {
          await snap.docs[0].ref.update({
            paymentFailed: true,
            updatedAt:     admin.firestore.FieldValue.serverTimestamp()
          });
        }
        break;
      }
    }

    res.status(200).json({ received: true });

  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).json({ error: "Internal error processing webhook" });
  }
};

// Required: disable body parser so Stripe can verify the raw body
module.exports.config = { api: { bodyParser: false } };
