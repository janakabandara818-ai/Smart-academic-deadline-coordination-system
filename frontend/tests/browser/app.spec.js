import { test, expect } from "@playwright/test";

test("lecturer dashboard and planner stay active while analysis is coming soon", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Welcome.*Dr\. Perera/ }),
  ).toBeVisible();
  await expect(page.locator(".stat-value").last()).toHaveText("72%");
  await expect(page.locator(".stat-value").last()).toHaveCSS(
    "color",
    "rgb(220, 38, 38)",
  );
  await page
    .getByRole("link", { name: "Deadline planner", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Plan a New Deadline" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Analyze & get suggestions/ }).click();
  await expect(page).toHaveURL(/\/planner$/);
  const title = page.getByRole("textbox", { name: /Assignment title/ });
  await title.fill("   ");
  await page.getByRole("button", { name: /Analyze & get suggestions/ }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "Please complete all required fields.",
  );
  await title.fill("Test Group Project");
  await page.getByRole("button", { name: /Analyze & get suggestions/ }).click();
  await expect(page).toHaveURL(/\/analysis$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Workload Analysis \u2013 Coming Soon",
  );
  await page.getByRole("link", { name: "Back to Dashboard" }).click();
  await expect(
    page.getByRole("heading", { name: /Welcome.*Dr\. Perera/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View all", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Assignment Deadlines",
  );
  expect(errors).toEqual([]);
});

test("reference layout stays compact and pages fit narrow phones, tablets and laptops", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  const layout = await page.evaluate(() => {
    const box = (selector) =>
      document.querySelector(selector).getBoundingClientRect();
    const header = box(".topbar");
    const university = box(".university-brand");
    const sidebar = box(".sidebar");
    const stats = [...document.querySelectorAll(".stat-card")].map((item) =>
      item.getBoundingClientRect(),
    );
    return {
      headerTop: header.top,
      universityLeft: university.left,
      universityRight: university.right,
      sidebarRight: sidebar.right,
      sidebarTop: sidebar.top,
      headerBottom: header.bottom,
      statTops: stats.map((item) => item.top),
      statHeights: stats.map((item) => item.height),
      dashboardBottom: box(".dashboard-main").bottom,
      active: getComputedStyle(document.querySelector(".nav-item.active"))
        .backgroundImage,
    };
  });
  expect(layout.headerTop).toBe(0);
  expect(layout.universityLeft).toBe(0);
  expect(layout.universityRight).toBe(layout.sidebarRight);
  expect(layout.sidebarTop).toBe(layout.headerBottom);
  expect(new Set(layout.statTops).size).toBe(1);
  expect(Math.max(...layout.statHeights)).toBeLessThanOrEqual(130);
  expect(layout.dashboardBottom).toBeLessThan(620);
  expect(layout.active).toContain("rgb(75, 175, 22)");
  await expect(
    page.locator(".overview-banner, .coordination-note, .planner-promo"),
  ).toHaveCount(0);
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 812 });
    for (const route of [
      "/",
      "/calendar",
      "/planner",
      "/analysis",
      "/suggestions",
      "/notifications",
      "/moodle",
      "/settings",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBeTruthy();
    }
    await page.goto("/");
    await page
      .getByRole("combobox", { name: "Demo role" })
      .selectOption("Student");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Student at ${width}px`,
    ).toBeTruthy();
    await page
      .getByRole("combobox", { name: "Demo role" })
      .selectOption("Admin");
    if (width <= 760)
      await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("link", { name: "Users & modules" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Admin at ${width}px`,
    ).toBeTruthy();
  }
});

test("inactive routes show Coming Soon for every demo role", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const routes = [
    ["/analysis", "Workload Analysis"],
    ["/suggestions", "Smart Suggestions"],
    ["/notifications", "Notifications"],
    ["/moodle", "Moodle Integration"],
    ["/admin", "Admin Management"],
    ["/settings", "Settings"],
    ["/unknown-page", "This page"],
  ];
  for (const role of ["Lecturer", "Student", "Admin"]) {
    await page.goto("/");
    await page.getByRole("combobox", { name: "Demo role" }).selectOption(role);
    for (const [route, feature] of routes) {
      if (role === "Lecturer") {
        // A fresh deep link defaults to Lecturer; other roles live in memory.
        await page.goto(route);
      } else {
        await page.evaluate((path) => {
          history.pushState({}, "", path);
          window.dispatchEvent(new PopStateEvent("popstate"));
        }, route);
      }
      await expect(page).toHaveURL(new RegExp(route + "$"));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        feature + " \u2013 Coming Soon",
      );
      await expect(page.locator("main form")).toHaveCount(0);
      await expect(page.locator("main button")).toHaveCount(0);
      await expect(
        page.getByRole("link", { name: "Back to Dashboard" }),
      ).toBeVisible();
    }
  }
  expect(errors).toEqual([]);
});

test("Student and Admin dashboards and planner stay inactive after role switching", async ({
  page,
}) => {
  await page.goto("/");
  for (const role of ["Student", "Admin"]) {
    await page.getByRole("combobox", { name: "Demo role" }).selectOption(role);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      (role === "Student" ? "Student Dashboard" : "Admin Management") +
        " \u2013 Coming Soon",
    );
    if (role === "Student") {
      await expect(
        page.getByRole("link", { name: "Deadline planner", exact: true }),
      ).toHaveCount(0);
    }
    // Client-side deep links preserve the current demo role.
    await page.evaluate(() => {
      history.pushState({}, "", "/planner");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    await expect(page).toHaveURL(/\/planner$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Deadline Planner \u2013 Coming Soon",
    );
    await expect(page.locator("main form")).toHaveCount(0);
    await page.getByRole("link", { name: "Back to Dashboard" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Coming Soon",
    );
  }
  await page.getByRole("combobox", { name: "Demo role" }).selectOption("Lecturer");
  await expect(
    page.getByRole("heading", { name: /Welcome.*Dr\. Perera/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Deadline planner", exact: true }).click();
  await expect(page.locator("#deadline-planner-form")).toBeVisible();
});

test("all pages fit a mobile screen and navigation collapses", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of [
    "/",
    "/calendar",
    "/planner",
    "/analysis",
    "/suggestions",
    "/notifications",
    "/moodle",
    "/settings",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("link", { name: "Unified calendar", exact: true })
    .click();
  await expect(page.locator(".sidebar")).not.toHaveClass(/is-open/);
  await expect(page).toHaveURL(/\/calendar$/);
  await page
    .getByRole("combobox", { name: "Demo role" })
    .selectOption("Student");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("combobox", { name: "Demo role" }).selectOption("Admin");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "Users & modules" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});
