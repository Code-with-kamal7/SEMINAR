import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  setPersistence, browserLocalPersistence, browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getFirestore, collection, getDocs, doc, getDoc, updateDoc, query, orderBy
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { firebaseConfig, USER_ID_DOMAIN } from "./firebase-config.js";
 
const ROLES = ["Student", "Staff", "Head", "Director", "Admin"];
const COLLECTIONS = {
  "Notice": "notices",
  "Time Table": "timetable",
  "Tutorials/Assignment": "assignments",
  "Syllabus": "syllabus"
};
// DEMO ONLY: saves the typed password (after a successful login) into your own users/<uid> document.
// This is insecure for real use. Set to false to turn it off.
const DEMO_SAVE_PASSWORD = true;
const GENERIC_ERROR = "Sign-in failed. Check your User ID, password and role, then try again.";
 
const $ = (id) => document.getElementById(id);
const loginPage = $("loginPage"), dashboardPage = $("dashboardPage");
const sidebar = $("sidebar"), cards = $("dashboardCards"), panel = $("contentPanel");
const toast = $("toast"), loginError = $("loginError"), signInBtn = $("signInBtn");
 
const configured = !firebaseConfig.apiKey.startsWith("PASTE_");
let auth = null, db = null;
if (configured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}
 
let me = null;          // { uid, role, userId, name }
let data = {};          // { "Notice": [{title, detail}], ... }
let loginBusy = false;
 
function showToast(message) {
  toast.textContent = message;
  toast.style.display = "block";
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => { toast.style.display = "none"; }, 2800);
}
 
function showLoginError(message) {
  loginError.textContent = message;
  loginError.classList.toggle("hidden", !message);
}
 
function toEmail(userId) {
  const id = userId.trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,30}$/.test(id)) return null;
  return id + "@" + USER_ID_DOMAIN;
}
 
function showLogin() {
  me = null; data = {};
  $("panelContent").textContent = "";
  dashboardPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
  sidebar.classList.remove("open");
}
 
function showDashboard() {
  loginPage.classList.add("hidden");
  dashboardPage.classList.remove("hidden");
  $("welcomeTitle").textContent = "MIS Dashboard";
  $("welcomeSubtitle").textContent =
    "Welcome, " + (me.name || me.userId || "user") + " \u2022 " + me.role;
  $("roleTag").textContent = me.role.toUpperCase();
  Object.keys(COLLECTIONS).forEach((s) => {
    document.querySelector('[data-count="' + s + '"]').textContent = (data[s] || []).length;
  });
  $("badge").textContent = (data["Notice"] || []).length;
  cards.classList.remove("hidden");
  panel.classList.add("hidden");
  sidebar.classList.remove("open");
  sidebar.querySelectorAll("[data-section]").forEach((b) =>
    b.classList.toggle("active", b.dataset.section === "Dashboard"));
}
 
async function loadData() {
  const out = {};
  await Promise.all(Object.entries(COLLECTIONS).map(async ([section, name]) => {
    const snap = await getDocs(query(collection(db, name), orderBy("order")));
    out[section] = snap.docs.map((d) => d.data());
  }));
  data = out;
}
 
// Checks the role stored in the signed-in user's secure token (set only by the admin script).
async function enter(user, expectedRole) {
  const token = await user.getIdTokenResult(true);
  const role = token.claims.role;
  if (!ROLES.includes(role) || (expectedRole && role !== expectedRole)) {
    await signOut(auth);
    return false;
  }
  const snap = await getDoc(doc(db, "users", user.uid));
  me = { uid: user.uid, role, ...(snap.exists() ? snap.data() : {}), role };
  await loadData();
  showDashboard();
  return true;
}
 
async function saveDemoPassword(uid, pw) {
  try { await updateDoc(doc(db, "users", uid), { password: pw }); }
  catch (e) { console.warn("Demo password save failed:", e && e.code); }
}
 
$("showPw")?.addEventListener("change", (e) => {
  $("password").type = e.target.checked ? "text" : "password";
});
 
$("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  showLoginError("");
  if (!configured) {
    showLoginError("Firebase is not set up yet. Paste your config into public/firebase-config.js (see README, Step 4).");
    return;
  }
  const email = toEmail($("userId").value);
  const password = $("password").value;
  const role = document.querySelector('input[name="role"]:checked').value;
  if (!email || !password) { showLoginError(GENERIC_ERROR); return; }
 
  loginBusy = true;
  signInBtn.disabled = true;
  try {
    await setPersistence(auth, $("remember").checked ? browserLocalPersistence : browserSessionPersistence);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const ok = await enter(cred.user, role);
    if (!ok) showLoginError(GENERIC_ERROR);
    else {
      if (DEMO_SAVE_PASSWORD) saveDemoPassword(cred.user.uid, password);
      $("loginForm").reset();
    }
  } catch (err) {
    console.warn("Sign-in error code:", err && err.code); // never log the password
    if (auth.currentUser) await signOut(auth).catch(() => {});
    if (err && err.code === "auth/too-many-requests") showLoginError("Too many attempts. Please wait a few minutes and try again.");
    else if (err && err.code === "auth/network-request-failed") showLoginError("Network problem. Check your internet connection.");
    else showLoginError(GENERIC_ERROR);
  } finally {
    loginBusy = false;
    signInBtn.disabled = false;
    $("password").value = "";
    $("password").type = "password";
    if ($("showPw")) $("showPw").checked = false;
  }
});
 
function openSection(section) {
  if (!me) return;
  sidebar.querySelectorAll("[data-section]").forEach((b) =>
    b.classList.toggle("active", b.dataset.section === section));
  if (section === "Dashboard") { showDashboard(); return; }
 
  cards.classList.add("hidden");
  panel.classList.remove("hidden");
  $("panelTitle").textContent = section;
  $("welcomeTitle").textContent = section;
  sidebar.classList.remove("open");
 
  const content = $("panelContent");
  content.textContent = "";
  const items = section === "Profile"
    ? [{ title: "User ID", detail: me.userId || "-" },
       { title: "Name", detail: me.name || "-" },
       { title: "Role", detail: me.role },
       { title: "Security", detail: "Your password is managed by Firebase Authentication and is never stored by this portal." }]
    : (data[section] || []);
  if (!items.length) items.push({ title: "Nothing here yet", detail: "" });
 
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "notice-item";
    const t = document.createElement("strong");
    t.textContent = item.title || "";   // textContent = safe from script injection
    row.appendChild(t);
    if (item.detail) row.appendChild(document.createTextNode(item.detail));
    content.appendChild(row);
  });
}
 
document.querySelectorAll("[data-section]").forEach((el) =>
  el.addEventListener("click", () => openSection(el.dataset.section)));
$("menuBtn").addEventListener("click", () => sidebar.classList.toggle("open"));
$("notificationBtn").addEventListener("click", () =>
  showToast("You have " + (data["Notice"] || []).length + " notices."));
$("profileBtn").addEventListener("click", () => openSection("Profile"));
$("backBtn").addEventListener("click", () => openSection("Dashboard"));
 
$("logoutBtn").addEventListener("click", async () => {
  try { await signOut(auth); } catch (e) { /* ignore */ }
  showLogin();
  showToast("You have been signed out.");
});
 
// Restores an existing Firebase session (e.g. after "Remember me" + page reload).
if (configured) {
  onAuthStateChanged(auth, async (user) => {
    if (loginBusy) return;            // the login handler is already checking this user
    if (!user) { showLogin(); return; }
    try {
      if (!(await enter(user, null))) showLogin();
    } catch (err) {
      console.warn("Session restore failed:", err && err.code);
      await signOut(auth).catch(() => {});
      showLogin();
    }
  });
}