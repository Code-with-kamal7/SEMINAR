// Creates 5 demo accounts (random one-time passwords) + sample dashboard content.
const { init, provisionUser } = require("./lib");

const DEMO = [
  { userId: "admin.demo", role: "Admin", name: "Demo Admin" },
  { userId: "director.demo", role: "Director", name: "Demo Director" },
  { userId: "head.demo", role: "Head", name: "Demo Head" },
  { userId: "staff.demo", role: "Staff", name: "Demo Staff" },
  { userId: "student.demo", role: "Student", name: "Demo Student" }
];
const CONTENT = {
  notices: ["Welcome to the MIS Portal.|Demo notice.", "Check the college notice board for academic updates.|Demo notice.", "Please check your timetable regularly.|Demo notice."],
  timetable: ["Monday \u2014 09:00 AM|Subject 1", "Tuesday \u2014 10:00 AM|Subject 2", "Wednesday \u2014 11:00 AM|Subject 3"],
  assignments: ["Assignment 1|Introduction to your subject", "Assignment 2|Practice and revision", "Tutorial 3|Review the relevant class notes"],
  syllabus: ["Semester 1|Syllabus overview", "Semester 2|Syllabus overview", "Official syllabus|Contact your department for the official syllabus."]
};

(async () => {
  const fb = init();
  console.log("\nDEMO ACCOUNTS (passwords are shown only once - copy them now):\n");
  for (const u of DEMO) {
    const r = await provisionUser(fb, u);
    console.log(r.userId.padEnd(15) + r.role.padEnd(10) + (r.password || "(already existed - password unchanged)"));
  }
  const batch = fb.db.batch();
  for (const [col, items] of Object.entries(CONTENT)) {
    items.forEach((s, i) => {
      const [title, detail] = s.split("|");
      batch.set(fb.db.doc(col + "/item" + (i + 1)), { title, detail, order: i + 1 });
    });
  }
  await batch.commit();
  console.log("\nSample notices, timetable, assignments and syllabus added.");
  process.exit(0);
})().catch((e) => { console.error("Error: " + e.message); process.exit(1); });
