// Shared helpers for the admin scripts. These run ONLY on your own computer.
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const admin = require("firebase-admin");

const ROLES = ["Student", "Staff", "Head", "Director", "Admin"];
const USER_ID_DOMAIN = "mis.shriram-demo.example"; // must match public/firebase-config.js
const USER_ID_RE = /^[a-z0-9._-]{3,30}$/;

function toEmail(userId) {
  const id = String(userId || "").trim().toLowerCase();
  if (!USER_ID_RE.test(id)) throw new Error("User ID must be 3-30 characters: letters, numbers, . _ -");
  return id + "@" + USER_ID_DOMAIN;
}

function generatePassword(length = 14) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[crypto.randomInt(chars.length)];
  return out;
}

function init() {
  const keyPath = process.env.SERVICE_ACCOUNT_PATH;
  if (!keyPath) throw new Error("SERVICE_ACCOUNT_PATH is missing. Copy .env.example to .env (see README).");
  const full = path.resolve(keyPath);
  if (!fs.existsSync(full)) throw new Error("Service account file not found: " + full);
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(full, "utf8"))) });
  return { auth: admin.auth(), db: admin.firestore() };
}

// Creates the user (or updates role/name if it exists). Returns the new password ONLY when one was set.
async function provisionUser({ auth, db }, { userId, role, name, reset = false }) {
  if (!ROLES.includes(role)) throw new Error("Role must be one of: " + ROLES.join(", "));
  const id = String(userId).trim().toLowerCase();
  const email = toEmail(id);
  let user, password = null;
  try {
    user = await auth.getUserByEmail(email);
    if (reset) { password = generatePassword(); await auth.updateUser(user.uid, { password }); }
    await auth.updateUser(user.uid, { displayName: name || user.displayName });
  } catch (e) {
    if (e.code !== "auth/user-not-found") throw e;
    password = generatePassword();
    user = await auth.createUser({ email, password, displayName: name || id, emailVerified: true });
  }
  await auth.setCustomUserClaims(user.uid, { role });   // the ONLY place roles are assigned
  await auth.revokeRefreshTokens(user.uid);              // forces fresh sign-in with the new role
  await db.doc("users/" + user.uid).set({
    userId: id, name: name || id, role, updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });                                   // no password is ever written here
  return { uid: user.uid, userId: id, role, password };
}

module.exports = { ROLES, toEmail, generatePassword, init, provisionUser, admin };
