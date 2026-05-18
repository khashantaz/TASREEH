// ============================================================
// TASREEH — Stripe Checkout API
// File: api/create-checkout.js
//
// Deploy on: Vercel (zero config — just push to GitHub)
// This runs as a serverless function at:
//   POST https://tasreeh.co.uk/api/create-checkout
//
// SETUP:
//   1. Run: npm install stripe
//   2. In Vercel dashboard → Settings → Environment Variables:
//      STRIPE_SECRET_KEY = sk_live_... (from stripe.com)
// ============================================================

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ── Tasreeh plan → Stripe price IDs ──
// Create these in your Stripe dashboard → Products
// Replace the values after you create them in Stripe
const PLAN_PRICES = {
  basic:    "price_REPLACE_WITH_BASIC_PRICE_ID",    // 75,000 IQD / month (~$57 USD)
  advanced: "price_REPLACE_WITH_ADVANCED_PRICE_ID", // 180,000 IQD / month (~$137 USD)
  per_tx:   "price_REPLACE_WITH_PER_TX_PRICE_ID"    // 35,000 IQD per transaction
};

module.exports = async function handler(req, res) {
  // CORS headers — allow tasreeh.co.uk
  res.setHeader("Access-Control-Allow-Origin", "https://tasreeh.co.uk");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "POST")    { res.status(405).json({ error: "Method not allowed" }); return; }

  const { plan, clientEmail, clientId, clientName } = req.body;

  if (!plan || !clientEmail || !clientId) {
    return res.status(400).json({ error: "Missing required fields: plan, clientEmail, clientId" });
  }

  const priceId = PLAN_PRICES[plan];
  if (!priceId || priceId.includes("REPLACE")) {
    return res.status(400).json({ error: `Unknown plan '${plan}' or price ID not configured` });
  }

  try {
    // Check if Stripe customer already exists for this client
    const existing = await stripe.customers.list({ email: clientEmail, limit: 1 });
    let customer;

    if (existing.data.length > 0) {
      customer = existing.data[0];
    } else {
      customer = await stripe.customers.create({
        email: clientEmail,
        name:  clientName || clientEmail,
        metadata: {
          firebase_uid: clientId,
          platform:     "tasreeh"
        }
      });
    }

    // Create Stripe Checkout Session
    const sessionConfig = {
      customer: customer.id,
      payment_method_types: ["card"],
      success_url: `https://tasreeh.co.uk/dashboard?payment=success&plan=${plan}`,
      cancel_url:  `https://tasreeh.co.uk/pricing?payment=cancelled`,
      metadata: {
        firebase_uid: clientId,
        plan,
        platform: "tasreeh"
      }
    };

    if (plan === "per_tx") {
      // One-time payment for per-transaction plan
      sessionConfig.mode = "payment";
      sessionConfig.line_items = [{ price: priceId, quantity: 1 }];
    } else {
      // Recurring subscription for basic / advanced
      sessionConfig.mode = "subscription";
      sessionConfig.line_items = [{ price: priceId, quantity: 1 }];
      sessionConfig.subscription_data = {
        metadata: { firebase_uid: clientId, plan }
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.status(200).json({ url: session.url, sessionId: session.id });

  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
