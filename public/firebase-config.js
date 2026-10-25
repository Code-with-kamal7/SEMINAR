// Paste the values from Firebase Console > Project settings > Your apps > Web app.
// These web-app values are NOT secrets (security comes from Firebase Rules + Auth).
export const firebaseConfig = {
  apiKey: "AIzaSyAfErAQPcLFLw02gyj0Xzqyrz_0BR0e7Ao",
  authDomain: "mis-portal-716de.firebaseapp.com",
  projectId: "mis-portal-716de",
  appId: "1:279001366887:web:1fad9594ad2cf5f80eafc2"
};
// User IDs are turned into a private, fake email: userid@<this domain>.
// Must match USER_ID_DOMAIN in scripts/lib.js. Do not change it after creating accounts.
export const USER_ID_DOMAIN = "mis.shriram-demo.example";
