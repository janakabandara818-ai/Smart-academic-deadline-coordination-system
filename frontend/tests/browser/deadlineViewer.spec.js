import { test, expect } from "@playwright/test";
import * as fixtures from "../../src/data/mockData.js";
import { formatDate } from "../../src/utils/workloadCalculator.js";

const titles = (items) => items.map((item) => `${item.moduleId} – ${item.title}`);
const rows = (page) => page.locator(".deadline-title strong");
const moduleFilter = (page) => page.getByRole("combobox", { name: "Module", exact: true });

async function capture(page, testInfo, name) {
  const path = testInfo.outputPath(`${name}.png`);
  await page.screenshot({ path, fullPage: true, animations: "disabled" });
  await testInfo.attach(name, { path, contentType: "image/png" });
}

// Substitute only the browser's fixture response; application code and seeds stay intact.
async function withDeadlines(page, deadlines) {
  await page.route(/\/src\/data\/mockData\.js(?:\?|$)/, (route) => route.fulfill({
    contentType: "text/javascript",
    body: Object.entries({ ...fixtures, initialDeadlines: deadlines })
      .map(([key, value]) => `export const ${key} = ${JSON.stringify(value)};`)
      .join("\n"),
  }));
}

test("Sprint 1: View all, module filters, repeat/reset and complete fixture fidelity", async ({ page }, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("link", { name: "View all", exact: true }).click();
  await expect(page).toHaveURL(/\/calendar$/);
  await expect(page.getByRole("heading", { name: "Assignment Deadlines", exact: true })).toBeVisible();
  await expect(rows(page)).toHaveText(titles(fixtures.initialDeadlines));
  await expect(page.getByText("Sample data · Not connected to live Moodle", { exact: true })).toBeVisible();
  await capture(page, testInfo, "all-deadlines");

  for (let cycle = 0; cycle < 3; cycle++) {
    for (const id of ["CS3202", "EE2101", "All", "CS3202", "SE3205", "All"]) {
      const expected = fixtures.initialDeadlines.filter((item) => id === "All" || item.moduleId === id);
      await moduleFilter(page).selectOption(id);
      await expect(moduleFilter(page)).toHaveValue(id);
      await expect(rows(page)).toHaveText(titles(expected));
      await expect(page.getByRole("status")).toContainText(`${expected.length} of 5 sample deadlines`);
      for (let index = 0; index < expected.length; index++) {
        await expect(page.locator(".deadline-row").nth(index)).toContainText(formatDate(expected[index].date, { year: undefined }));
      }
      if (cycle === 0 && ["CS3202", "EE2101"].includes(id)) await capture(page, testInfo, `module-${id}`);
    }
  }
  for (const item of fixtures.initialDeadlines) {
    await page.getByRole("button", { name: new RegExp(`${item.moduleId}.*${item.title}`) }).click();
    const dialog = page.getByRole("dialog", { name: "Deadline details", exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(item.title);
    await expect(dialog).toContainText(item.moduleId);
    await expect(dialog).toContainText(formatDate(item.date, { weekday: "long" }));
    await expect(dialog).toContainText(`Due at ${item.time} · Sri Lanka time`);
    await page.getByRole("button", { name: "Done", exact: true }).click();
  }
  await page.reload();
  await expect(rows(page)).toHaveText(titles(fixtures.initialDeadlines));
  expect(errors).toEqual([]);
});

test("Sprint 1: empty module clears stale rows and All modules restores the dataset", async ({ page }, testInfo) => {
  const seeded = fixtures.initialDeadlines.filter((item) => item.moduleId !== "CS3202");
  await withDeadlines(page, seeded);
  await page.goto("/calendar");
  await moduleFilter(page).selectOption("EE2101");
  await expect(rows(page)).toHaveCount(2);
  await moduleFilter(page).selectOption("CS3202");
  await expect(rows(page)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "No deadlines for this module" })).toBeVisible();
  await expect(page.getByText("Choose All modules or another module to see its deadlines.")).toBeVisible();
  await expect(page.getByRole("status")).toContainText("0 of 4 sample deadlines");
  await capture(page, testInfo, "empty-module");
  await moduleFilter(page).selectOption("All");
  await expect(rows(page)).toHaveText(titles(seeded));
});

test("Sprint 1: entire empty dataset has an informative state with no stale records", async ({ page }, testInfo) => {
  await page.goto("/calendar");
  await expect(rows(page)).toHaveCount(5);
  await withDeadlines(page, []);
  await page.reload();
  await expect(rows(page)).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("0 of 0 sample deadlines");
  await expect(page.getByRole("heading", { name: "No deadlines available" })).toBeVisible();
  await expect(page.getByText("There are no assignment deadlines in this sample dataset.")).toBeVisible();
  await capture(page, testInfo, "empty-dataset");
  await moduleFilter(page).selectOption("EE2101");
  await expect(rows(page)).toHaveCount(0);
  await moduleFilter(page).selectOption("All");
  await expect(page.getByRole("heading", { name: "No deadlines available" })).toBeVisible();
});

test("Sprint 1: named details dialog supports keyboard opening, focus and closing", async ({ page }, testInfo) => {
  await page.goto("/calendar");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const row = page.locator(".deadline-row").first();
  await row.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Deadline details", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await capture(page, testInfo, "named-deadline-details");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(row).toBeFocused();
});

test("Sprint 1: mobile filters and due dates remain visible", async ({ page }, testInfo) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto("/calendar");
    await expect(moduleFilter(page)).toBeVisible();
    await moduleFilter(page).selectOption("EE2101");
    await expect(rows(page)).toHaveText(titles(fixtures.initialDeadlines.filter((item) => item.moduleId === "EE2101")));
    await expect(page.locator(".deadline-date").first()).toContainText("Nov 16");
    await expect(page.locator(".deadline-date").last()).toContainText("Nov 20");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await capture(page, testInfo, `mobile-${width}-filtered`);
  }
});
