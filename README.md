# Shri Ram Group of Colleges - MIS Portal (Firebase demo)

Educational demo with **real** Firebase sign-in. Do not use real college passwords or student data.

## How it works (short version)
- You type a **User ID** + password. The page turns the User ID into a private fake email (`userid@mis.shriram-demo.example`) and Firebase Authentication checks the password. Passwords are never saved by this project.
- Each account has a **role** (Student, Staff, Head, Director, Admin) stored inside Firebase's secure sign-in token. Only the scripts on **your computer** (using your private key) can set roles. The browser cannot.
- **Firestore Rules** (`firestore.rules`) enforce this on the server: no role = no data; nobody can edit roles or profiles from the browser; only Admin can change dashboard content.
- The role you tick on the login page must match the account's real role, otherwise sign-in is refused.

## What you need on Windows
1. **Node.js LTS** from https://nodejs.org (install with defaults).
2. A Google account for https://console.firebase.google.com
3. Your logo file `shriram-logo.jpg` copied into the `public` folder (optional; a text logo shows if missing).

## Steps
1. **Extract** the ZIP to `C:\` so you get `C:\mis-portal\package.json`.
2. Open **CMD** and run:
   ```
   cd C:\mis-portal
   npm install
   copy .env.example .env
   ```
3. **Create the Firebase project** (console.firebase.google.com):
   - Add project -> name it -> (Google Analytics can be off) -> Create.
   - Build -> **Authentication** -> Get started -> Sign-in method -> enable **Email/Password** -> Save.
   - Authentication -> Settings -> User actions: if you see "Enable create (sign-up)", turn it **off** (accounts are created only by your script).
   - Build -> **Firestore Database** -> Create database -> choose a location -> **Production mode**.
4. **Paste the Web config**: Project settings (gear icon) -> General -> Your apps -> click the `</>` Web icon -> register app -> copy `apiKey`, `authDomain`, `projectId`, `appId` into `public\firebase-config.js` (replace the `PASTE_...` text). These are not secrets.
5. **Get your private key** (this one IS secret): Project settings -> **Service accounts** -> Generate new private key. Save the file as `C:\mis-portal\service-account.json`. Never email, upload or share it. It is already in `.gitignore`.
6. **Publish the security rules**: Firestore Database -> **Rules** tab -> delete everything -> paste the contents of `firestore.rules` -> **Publish**.
7. **Create demo accounts + sample data** (in CMD):
   ```
   npm run seed
   ```
   It prints 5 demo User IDs with random passwords **once**. Copy them somewhere safe.
8. **Run**:
   ```
   npm start
   ```
   Open http://localhost:3000, sign in as `admin.demo`, the printed password, role **Admin**. Stop the server with Ctrl+C.

## Everyday commands
- New account: `npm run create-user -- --id staff2 --role Staff --name "Ravi Sharma"`
- Change role: run the same command with the new `--role`.
- Forgot password: `npm run create-user -- --id staff2 --role Staff --reset` (prints a new one-time password).

## Password recovery
Because login uses User IDs (not real emails), Firebase's "email me a reset link" cannot work. An administrator resets passwords with the `--reset` command above. For real use you would store each person's real email and add a proper reset flow.

## Deploy (optional, free Spark plan is enough for a demo)
```
npx firebase-tools login
npx firebase-tools use --add
npx firebase-tools deploy --only hosting,firestore:rules
```
Run `npm run seed` / `create-user` from your own PC only; the key never goes online.

## Safety checklist
- Never commit or share `service-account.json` or `.env`.
- Use only fake demo data. Delete demo accounts (Firebase Console -> Authentication) before any real use.
- Rotate the private key (Service accounts -> delete old key, generate new) if it ever leaks.
- Not included: a Content-Security-Policy header, App Check, multi-factor login. Consider these before real use.

## Files
`public/` website (index.html, styles.css, app.js, firebase-config.js) | `server.js` local web server | `scripts/` account + sample-data scripts | `firestore.rules` | `firebase.json` Hosting/rules config
