import { test, expect } from "@playwright/test";

test("lecturer planning updates shared deadlines and notifications", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Good afternoon/ }),
  ).toBeVisible();
  await expect(page.locator(".stat-value").last()).toHaveText("72%");
  await expect(page.locator(".stat-value").last()).toHaveCSS(
    "color",
    "rgb(220, 38, 38)",
  );
  await page
    .getByRole("link", { name: "Deadline planner", exact: true })
    .click();
  await page.getByRole("button", { name: /Analyze & get suggestions/ }).click();
  await expect(page).toHaveURL(/\/planner$/);
  await page
    .getByRole("textbox", { name: /Assignment title/ })
    .fill("Test Group Project");
  await page.getByRole("button", { name: /Analyze & get suggestions/ }).click();
  await expect(
    page.getByRole("img", { name: "85 percent workload, Conflict" }),
  ).toBeVisible();
  await expect(page.locator(".gauge-fill")).toHaveCSS(
    "stroke",
    "rgb(220, 38, 38)",
  );
  await page.getByRole("button", { name: "Explore alternative dates" }).click();
  await expect(page.getByRole("radio")).toHaveCount(3);
  await page.getByRole("radio").nth(1).check();
  await page.getByRole("button", { name: "Confirm selected date" }).click();
  await expect(page).toHaveURL(/\/calendar$/);
  await page.getByRole("button", { name: "List", exact: true }).click();
  await page.getByRole("button", { name: /Test Group Project/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Test Group Project");
  await page.keyboard.press("Escape");
  await page
    .getByRole("link", { name: /^Notifications/ })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "New deadline coordinated" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Mark all as read" }).click();
  await page.getByRole("button", { name: /^Unread/ }).click();
  await expect(
    page.getByRole("heading", { name: "You’re all caught up" }),
  ).toBeVisible();
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

test("calendar navigation, filtering, date selection and alternative views work", async ({
  page,
}) => {
  await page.goto("/calendar");
  await page.getByRole("button", { name: "Next month", exact: true }).click();
  await expect(page.locator(".calendar-date-navigation")).toContainText(
    "December 2026",
  );
  await page
    .getByRole("button", { name: "Previous month", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Module", exact: true })
    .selectOption("EE2101");
  await page
    .getByRole("button", { name: "Friday, Nov 20, 2026, 1 deadlines" })
    .click();
  await expect(page.locator(".calendar-detail-column")).toContainText(
    "Lab Report",
  );
  await page.getByRole("button", { name: "Week", exact: true }).click();
  await expect(page.locator(".calendar-day")).toHaveCount(7);
  await page.getByRole("button", { name: "Next week" }).click();
  await page.getByRole("button", { name: "List", exact: true }).click();
  await expect(page.locator(".agenda-row")).toHaveCount(2);
});

test("student restrictions, admin CRUD, preferences and honest Moodle feedback", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("combobox", { name: "Demo role" })
    .selectOption("Student");
  await expect(
    page.getByRole("heading", { name: "My Deadlines", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Deadline planner", exact: true }),
  ).toHaveCount(0);
  // Client-side navigation preserves the current demo role.
  await page.evaluate(() => {
    history.pushState({}, "", "/admin");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: "My Deadlines", exact: true }),
  ).toBeVisible();
  await page.getByRole("combobox", { name: "Demo role" }).selectOption("Admin");
  await page.getByRole("link", { name: "Users & modules" }).click();
  await page.getByRole("button", { name: "Add user", exact: true }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("Test Student");
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("test@eng.ruh.ac.lk");
  await page.getByRole("button", { name: "Save user", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search users" })
    .fill("Test Student");
  await expect(
    page.getByRole("cell", { name: "Test Student", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit Test Student" }).click();
  await page
    .getByRole("textbox", { name: "Full name" })
    .fill("Updated Student");
  await page.getByRole("button", { name: "Save user", exact: true }).click();
  await page.getByRole("textbox", { name: "Search users" }).fill("Updated");
  await page.getByRole("button", { name: "Delete Updated Student" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No matches found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Modules", exact: true }).click();
  await page.getByRole("button", { name: "Add module", exact: true }).click();
  await page.getByRole("textbox", { name: "Module code" }).fill("CS9999");
  await page.getByRole("textbox", { name: "Module name" }).fill("Test Module");
  await page
    .getByRole("textbox", { name: "Lecturer", exact: true })
    .fill("Dr. Test");
  await page.getByRole("button", { name: "Save module" }).click();
  await expect(
    page.getByRole("cell", { name: "Test Module", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Delete Test Module" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "Test Module", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Moodle integration" }).click();
  await page.getByRole("button", { name: /Sync now/ }).click();
  await expect(page.locator(".feedback")).toContainText(
    "No Moodle request was made",
  );
  await expect(page.getByText("Not Connected – Demo Mode")).toBeVisible();
  await page.getByRole("link", { name: "Users & modules" }).click();
  await page
    .getByRole("button", { name: "System settings", exact: true })
    .click();
  await page.getByRole("textbox", { name: "Academic year" }).fill("2027/2028");
  await page.getByRole("button", { name: "Save system settings" }).click();
  await page.getByRole("link", { name: "Moodle integration" }).click();
  await page.getByRole("link", { name: "Users & modules" }).click();
  await page
    .getByRole("button", { name: "System settings", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Academic year" }),
  ).toHaveValue("2027/2028");
  await page
    .getByRole("link", { name: /^Notifications/ })
    .first()
    .click();
  await page.getByRole("button", { name: "Email preferences" }).click();
  await page.getByRole("checkbox", { name: /Weekly summary/ }).check();
  await page.getByRole("button", { name: "Save preferences" }).click();
  await page.getByRole("button", { name: "Email preferences" }).click();
  await expect(
    page.getByRole("checkbox", { name: /Weekly summary/ }),
  ).toBeChecked();
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "WhatsApp share", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Open WhatsApp draft" }),
  ).toHaveAttribute("href", /^https:\/\/wa.me\/\?text=/);
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
