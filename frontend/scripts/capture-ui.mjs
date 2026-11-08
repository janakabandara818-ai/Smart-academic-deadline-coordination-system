import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile, copyFile, access } from "node:fs/promises";
import { resolve } from "node:path";

// Capture the running application, including role-specific screens, at one
// consistent desktop viewport. The contact sheet uses those same screenshots.
const baseURL = process.env.SADCS_PREVIEW_URL || "http://127.0.0.1:5180";
const output = resolve("screenshots");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 620 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const screens = [
  ["01-dashboard", "Dashboard (Overview)", "/"],
  ["02-calendar", "Unified Deadline Calendar", "/calendar"],
  ["03-planner", "Deadline Planner", "/planner"],
  ["04-analysis", "Workload & Conflict Analysis", "/analysis"],
  ["05-suggestions", "Smart Date Suggestions", "/suggestions"],
  ["06-notifications", "Notifications", "/notifications"],
  ["07-moodle", "Moodle Integration", "/moodle"],
  ["08-admin", "User & Module Management", "/admin", "Admin"],
  ["09-student", "Student Deadline Overview", "/", "Student"],
];
const captures = [];
for (const [name, title, route, role] of screens) {
  await page.goto(`${baseURL}${role ? "/" : route}`);
  if (role) {
    await page.getByRole("combobox", { name: "Demo role" }).selectOption(role);
    if (role === "Admin")
      await page.getByRole("link", { name: "Users & modules" }).click();
  }
  if (name === "03-planner")
    await page
      .getByRole("textbox", { name: /Assignment title/ })
      .fill("Group Project – System Design");
  await page.locator("h1").waitFor();
  await page.screenshot({
    path: resolve(output, `${name}.png`),
    fullPage: true,
  });
  const png = await page.screenshot();
  captures.push({ name, title, data: png.toString("base64") });
}
await page.setViewportSize({ width: 375, height: 812 });
for (const route of ["/", "/calendar", "/planner"]) {
  await page.goto(`${baseURL}${route}`);
  await page.screenshot({
    path: resolve(
      output,
      `mobile-${route === "/" ? "dashboard" : route.slice(1)}.png`,
    ),
    fullPage: true,
  });
}
// Compare the prior and corrected dashboard at the exact same viewport size.
try {
  await access(resolve(".qa/dashboard.png"));
  await copyFile(
    resolve(".qa/dashboard.png"),
    resolve(output, "before-dashboard.png"),
  );
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto(baseURL);
  await page.screenshot({
    path: resolve(output, "after-dashboard-same-viewport.png"),
    fullPage: true,
  });
  const before = (await readFile(resolve(output, "before-dashboard.png"))).toString("base64");
  const after = (await readFile(resolve(output, "after-dashboard-same-viewport.png"))).toString("base64");
  await page.setViewportSize({ width: 1456, height: 590 });
  await page.setContent(`<!doctype html><html><head><style>body{margin:0;padding:8px;background:#eef3e9;font:16px Arial}main{display:flex;gap:8px}section{width:716px;background:white;border-radius:10px;overflow:hidden}h2{font-size:18px;padding:10px;margin:0;color:#123d1b}img{width:716px;height:522px;object-fit:cover;object-position:top;display:block}p{font-size:12px;color:#45613a;margin:8px 0}</style></head><body><main><section><h2>Before</h2><img src="data:image/png;base64,${before}"></section><section><h2>After · Reference layout correction</h2><img src="data:image/png;base64,${after}"></section></main><p>Both captured at the same 1440 × 1050 browser viewport. The comparison shows the first viewport of each page.</p></body></html>`);
  await page.screenshot({ path: resolve(output, "before-after-dashboard.png"), fullPage: true });
} catch {
  /* The previous capture is optional on another checkout. */
}
const html = `<!doctype html><html><head><meta charset="utf-8"><title>SADCS · Implemented screens</title><style>*{box-sizing:border-box}body{margin:0;padding:8px;background:#f2f5ef;font-family:Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(3,550px);gap:10px}.screen{overflow:hidden;border:1px solid #ced8c8;border-radius:14px;background:white;box-shadow:0 2px 3px #123d1b25}h2{display:inline-block;border-radius:10px;background:#247a16;color:white;font-size:16px;margin:0;padding:4px 12px;line-height:21px}img{display:block;width:550px;height:310px}p{font-size:12px;color:#45613a;margin:12px 0 3px}</style></head><body><div class="grid">${captures.map((screen, i) => `<section class="screen"><h2>${i + 1}. ${screen.title}</h2><img src="data:image/png;base64,${screen.data}" alt="${screen.title}"></section>`).join("")}</div><p>Actual running React application · November 2026 demo data · University logo placeholder · Moodle disconnected</p></body></html>`;
await writeFile(resolve(output, "all-screens.html"), html);
await page.setViewportSize({ width: 1686, height: 1065 });
await page.setContent(html);
await page.screenshot({
  path: resolve(output, "all-nine-screens.png"),
  fullPage: true,
});
// Record the screenshots with normal relative links for easy local review.
await writeFile(
  resolve(output, "README.md"),
  `# SADCS implemented screens\n\nCaptured from the actual local React application at 1100 × 620.\n\n[All nine screens](all-nine-screens.png) · [Interactive-size gallery](all-screens.html)\n\n${screens.map(([name, title]) => `- [${title}](${name}.png)`).join("\n")}\n\n[Mobile dashboard](mobile-dashboard.png) · [Mobile calendar](mobile-calendar.png) · [Mobile planner](mobile-planner.png)\n`,
);
await browser.close();
if (errors.length) throw new Error(errors.join("\n"));
console.log(
  `Captured nine desktop screens, mobile views, and a contact sheet in ${output}`,
);
