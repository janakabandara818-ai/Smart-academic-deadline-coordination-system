/**
 * Demo scoring assumptions (replace/calibrate against real cohort data later):
 * C1: count of existing deadlines within ±3 calendar days, plus the proposed
 * deadline, divided by a capacity of 5. All modules share one demo cohort.
 * C2: type weight / 4, adjusted by complexity (low .5, medium .75, high 1).
 * C3: day penalty: Tue–Thu 0, Monday/Friday .6, weekends .7.
 * Each input is clamped to [0,1]. Score = .40 C1 + .35 C2 + .25 C3.
 * Classification uses the unrounded score: <= .40 approved, <= .65 caution,
 * otherwise conflict. Percentages are display-only rounding.
 * Dates are parsed at local noon to avoid UTC shifts and DST-midnight issues.
 */
export const complexityWeights = { Quiz: 1, Lab: 2, Assignment: 3, Project: 4 };
export const parseDate = (value) => new Date(`${value}T12:00:00`);
export const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export function addDays(value, days) {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}
export const formatDate = (value, options = {}) =>
  parseDate(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });
export function classifyScore(score) {
  if (score <= 0.4)
    return {
      level: "Approved",
      className: "approved",
      description: "Balanced workload",
    };
  if (score <= 0.65)
    return {
      level: "Caution",
      className: "caution",
      description: "Moderate workload",
    };
  return {
    level: "Conflict",
    className: "conflict",
    description: "High workload",
  };
}
export function calculateWorkload(proposal, deadlines) {
  if (!proposal?.date || Number.isNaN(parseDate(proposal.date).getTime()))
    throw new Error("A valid deadline date is required.");
  const start = addDays(proposal.date, -3);
  const end = addDays(proposal.date, 3);
  const nearby = deadlines.filter(
    (item) => item.id !== proposal.id && item.date >= start && item.date <= end,
  );
  const density = Math.min((nearby.length + 1) / 5, 1);
  const complexity =
    ((complexityWeights[proposal.type] || 3) / 4) *
    ({ Low: 0.5, Medium: 0.75, High: 1 }[proposal.complexity] || 0.75);
  const day = parseDate(proposal.date).getDay();
  const preference = [0, 6].includes(day)
    ? 0.7
    : [1, 5].includes(day)
      ? 0.6
      : 0;
  const score = Math.min(
    1,
    Math.max(0, 0.4 * density + 0.35 * complexity + 0.25 * preference),
  );
  return {
    score,
    percent: Math.round(score * 100),
    ...classifyScore(score),
    nearby,
    count: nearby.length + 1,
    moduleCount: new Set([
      ...nearby.map((item) => item.moduleId),
      proposal.moduleId,
    ]).size,
    factors: { density, complexity, preference },
    start,
    end,
  };
}
export function suggestDates(proposal, deadlines) {
  const original = calculateWorkload(proposal, deadlines);
  // Search the following 14 days; weekdays only, strictly lower scores.
  return Array.from({ length: 14 }, (_, i) => addDays(proposal.date, i + 1))
    .filter((date) => ![0, 6].includes(parseDate(date).getDay()))
    .map((date) => ({
      date,
      ...calculateWorkload({ ...proposal, date }, deadlines),
    }))
    .filter((result) => result.score < original.score)
    .sort((a, b) => a.score - b.score || a.date.localeCompare(b.date))
    .slice(0, 3);
}
