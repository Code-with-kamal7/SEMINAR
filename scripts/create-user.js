// Usage:  npm run create-user -- --id staff2 --role Staff --name "Ravi Sharma"
//         npm run create-user -- --id staff2 --role Staff --reset     (new random password)
const { init, provisionUser } = require("./lib");

const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };

(async () => {
  const userId = get("--id"), role = get("--role"), name = get("--name");
  if (!userId || !role) {
    console.log('Usage: npm run create-user -- --id <userid> --role <Student|Staff|Head|Director|Admin> [--name "Full Name"] [--reset]');
    process.exit(1);
  }
  const r = await provisionUser(init(), { userId, role, name, reset: args.includes("--reset") });
  console.log("\nUser ID : " + r.userId + "\nRole    : " + r.role);
  console.log(r.password
    ? "Password: " + r.password + "   <-- shown ONCE. Save it now; it is not stored anywhere."
    : "Password: unchanged (user already existed). Add --reset to set a new one.");
  process.exit(0);
})().catch((e) => { console.error("Error: " + e.message); process.exit(1); });
