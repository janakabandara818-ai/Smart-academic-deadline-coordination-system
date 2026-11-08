import { modules, deadlines } from '../fixtures/sampleData.js';

// Sprint 1: data comes from clearly labelled sample fixtures.
// Sprint 3: replace this file with Firestore; the controller stays the same.
export function findAllDeadlines() {
  return deadlines;
}

export function findAllModules() {
  return modules;
}
