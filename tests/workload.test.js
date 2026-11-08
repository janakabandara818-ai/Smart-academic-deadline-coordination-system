import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addDays,
  calculateWorkload,
  classifyScore,
  suggestDates,
} from "../src/utils/workloadCalculator.js";
import { initialDeadlines, sampleProposal } from "../src/data/mockData.js";

test("sample high-complexity proposal scores 85% and is a conflict", () => {
  const result = calculateWorkload(sampleProposal, initialDeadlines);
  assert.equal(result.percent, 85);
  assert.equal(result.level, "Conflict");
  assert.equal(result.count, 4);
  assert.equal(result.moduleCount, 3);
  assert.equal(result.start, "2026-11-11");
  assert.equal(result.end, "2026-11-17");
});
test("classification boundaries use unrounded scores", () => {
  assert.equal(classifyScore(0.4).level, "Approved");
  assert.equal(classifyScore(0.40001).level, "Caution");
  assert.equal(classifyScore(0.65).level, "Caution");
  assert.equal(classifyScore(0.65001).level, "Conflict");
});
test("density includes both window boundaries and excludes the same assessment", () => {
  const proposal = {
    id: "self",
    date: "2026-11-14",
    type: "Project",
    complexity: "High",
    moduleId: "CS3202",
  };
  const deadlines = [
    "2026-11-10",
    "2026-11-11",
    "2026-11-17",
    "2026-11-18",
  ].map((date, id) => ({ date, id, moduleId: "CS3202" }));
  const result = calculateWorkload(proposal, [...deadlines, proposal]);
  assert.equal(result.count, 3);
  assert.equal(result.nearby.length, 2);
});
test("density is capped and higher complexity raises the score", () => {
  const crowded = Array.from({ length: 30 }, (_, id) => ({
    id,
    date: sampleProposal.date,
    moduleId: "CS3202",
  }));
  const high = calculateWorkload(sampleProposal, crowded);
  const low = calculateWorkload(
    { ...sampleProposal, type: "Quiz", complexity: "Low" },
    crowded,
  );
  assert.equal(high.factors.density, 1);
  assert.ok(high.score <= 1);
  assert.ok(high.score > low.score);
});
test("Tuesday to Thursday are preferred over Monday and Friday", () => {
  const dates = [
    "2026-11-23",
    "2026-11-24",
    "2026-11-25",
    "2026-11-26",
    "2026-11-27",
  ];
  const scores = dates.map(
    (date) => calculateWorkload({ ...sampleProposal, date }, []).score,
  );
  assert.ok(scores[1] < scores[0]);
  assert.equal(scores[1], scores[2]);
  assert.equal(scores[2], scores[3]);
  assert.ok(scores[3] < scores[4]);
});
test("recommendations are actual recalculations, lower, ranked, unique weekdays", () => {
  const result = suggestDates(sampleProposal, initialDeadlines);
  assert.equal(result.length, 3);
  assert.equal(new Set(result.map((item) => item.date)).size, 3);
  result.forEach((item, index) => {
    assert.equal(
      item.score,
      calculateWorkload(
        { ...sampleProposal, date: item.date },
        initialDeadlines,
      ).score,
    );
    assert.ok(
      item.score < calculateWorkload(sampleProposal, initialDeadlines).score,
    );
    assert.ok(
      item.date > sampleProposal.date &&
        item.date <= addDays(sampleProposal.date, 14),
    );
    assert.ok(![0, 6].includes(new Date(`${item.date}T12:00:00`).getDay()));
    if (index) assert.ok(result[index - 1].score <= item.score);
  });
});
test("lowest possible scores have no better alternatives", () => {
  assert.deepEqual(
    suggestDates(
      {
        ...sampleProposal,
        date: "2026-11-24",
        type: "Quiz",
        complexity: "Low",
      },
      [],
    ),
    [],
  );
});
test("calendar date arithmetic handles year and month boundaries", () => {
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2026-03-01", -1), "2026-02-28");
});
