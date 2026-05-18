/* ============================================================
   TASREEH — Auth Pages Stylesheet
   File: public/css/auth.css
   Matches tasreeh.co.uk brand: dark navy + gold accent
   ============================================================ */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --gold:       #C9A84C;
  --gold-light: #E8D5A3;
  --navy:       #0D1B2A;
  --navy-mid:   #1A2F45;
  --navy-light: #243B55;
  --text:       #F0EBE0;
  --text-muted: #8A9BAD;
  --success-bg: rgba(46, 125, 82, 0.18);
  --success-bd: rgba(46, 125, 82, 0.4);
  --success-tx: #6fcf97;
  --error-bg:   rgba(192, 57, 43, 0.18);
  --error-bd:   rgba(192, 57, 43, 0.4);
  --error-tx:   #eb7a6f;
}

body {
  font-family: 'IBM Plex Sans Arabic', 'DM Sans', sans-serif;
  background: var(--navy);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── LOGO BACK LINK ── */
.logo-back {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1.25rem 2rem;
  text-decoration: none;
  align-self: flex-start;
}
.logo-mark {
  width: 34px; height: 34px;
  background: var(--gold);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 500; color: var(--navy);
}
.logo-text {
  font-size: 14px; font-weight: 500; color: var(--text);
}

/* ── WRAPPER ── */
.auth-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 1rem 2rem;
  width: 100%;
}

/* ── CARD ── */
.auth-card {
  background: var(--navy-mid);
  border: 1px solid rgba(201, 168, 76, 0.18);
  border-radius: 14px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
}

/* ── TABS ── */
.tabs {
  display: flex;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 3px;
  margin-bottom: 1.75rem;
}
.tab {
  flex: 1; padding: 9px 8px;
  font-family: inherit; font-size: 13px; font-weight: 400;
  color: var(--text-muted);
  background: transparent;
  border: none; cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  white-space: nowrap;
}
.tab.active {
  background: var(--gold);
  color: var(--navy);
  font-weight: 500;
}

/* ── PANEL ── */
.panel.hidden  { display: none; }
.panel.active  { display: block; }

.panel-title {
  font-size: 20px; font-weight: 500;
  color: var(--text);
  margin-bottom: 4px;
}
.panel-sub {
  font-size: 12px; font-weight: 300;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

/* ── FIELDS ── */
.field { margin-bottom: 14px; }
.field label {
  display: block;
  font-size: 11px; font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 5px;
}
.field input,
.field select {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 7px;
  padding: 10px 12px;
  font-family: inherit; font-size: 13px;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  direction: ltr; /* emails/passwords always LTR */
}
.field input:focus,
.field select:focus {
  border-color: var(--gold);
  background: rgba(201, 168, 76, 0.07);
}
.field input::placeholder { color: rgba(138,155,173,0.5); }
.field select option { background: var(--navy); }
.field select { appearance: none; cursor: pointer; }

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.forgot {
  display: block;
  text-align: left;
  margin-top: 5px;
  font-size: 11px;
  color: var(--gold);
  cursor: pointer;
  text-decoration: none;
}

/* ── BUTTONS ── */
.btn-primary {
  width: 100%; padding: 11px;
  background: var(--gold);
  color: var(--navy);
  font-family: inherit; font-size: 14px; font-weight: 500;
  border: none; border-radius: 8px;
  cursor: pointer; margin-top: 4px;
  transition: opacity 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.btn-primary:hover { opacity: 0.88; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-en { font-size: 12px; font-weight: 400; opacity: 0.75; font-family: 'DM Sans', sans-serif; }

.btn-google {
  width: 100%; padding: 10px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px; cursor: pointer;
  font-family: inherit; font-size: 13px;
  color: var(--text-muted);
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: border-color 0.2s, color 0.2s;
}
.btn-google:hover { border-color: var(--gold); color: var(--gold-light); }

.btn-outline {
  width: 100%; padding: 9px;
  background: transparent;
  border: 1px solid var(--gold);
  border-radius: 7px; cursor: pointer;
  font-family: inherit; font-size: 13px;
  color: var(--gold);
  margin-top: 8px;
  transition: background 0.2s;
}
.btn-outline:hover { background: rgba(201, 168, 76, 0.1); }

.btn-ghost {
  width: 100%; padding: 8px;
  background: transparent; border: none; cursor: pointer;
  font-family: inherit; font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}
.btn-ghost:hover { color: var(--text); }

/* ── DIVIDER ── */
.divider {
  display: flex; align-items: center; gap: 10px;
  margin: 1rem 0;
  color: var(--text-muted); font-size: 11px;
}
.divider::before, .divider::after {
  content: ''; flex: 1;
  height: 1px; background: rgba(255,255,255,0.08);
}

/* ── MESSAGES ── */
.msg-box {
  border-radius: 7px;
  padding: 9px 13px;
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 12px;
}
.msg-box.hidden  { display: none; }
.msg-box.success { background: var(--success-bg); border: 1px solid var(--success-bd); color: var(--success-tx); }
.msg-box.error   { background: var(--error-bg);   border: 1px solid var(--error-bd);   color: var(--error-tx); }

/* ── RESET BOX ── */
.reset-box {
  margin-top: 1rem;
  padding: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
}
.reset-box.hidden { display: none; }
.reset-title { font-size: 13px; color: var(--text); margin-bottom: 10px; }

/* ── FOOTER ── */
.auth-footer {
  margin-top: 1.5rem;
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 300;
  text-align: center;
}

/* ── RESPONSIVE ── */
@media (max-width: 520px) {
  .auth-card { padding: 1.25rem; border-radius: 10px; }
  .field-row { grid-template-columns: 1fr; }
  .tab { font-size: 11px; }
}
