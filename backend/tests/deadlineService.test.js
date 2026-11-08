import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deadlines } from '../src/fixtures/sampleData.js';
import { filterDeadlines } from '../src/services/deadlineService.js';

test('all modules returns every deadline in date order', () => {
  assert.deepEqual(filterDeadlines(deadlines, 'all').map((d) => d.date),
    ['2026-11-14', '2026-11-16', '2026-11-17', '2026-11-20', '2026-11-27']);
});

test('"All" from the frontend dropdown also returns every deadline', () => {
  assert.equal(filterDeadlines(deadlines, 'All').length, 5);
});

test('single module filter returns only that module', () => {
  assert.deepEqual(filterDeadlines(deadlines, 'EE2101').map((d) => d.id), ['d2', 'd4']);
});

test('unknown module returns an empty list (empty state)', () => {
  assert.deepEqual(filterDeadlines(deadlines, 'XX9999'), []);
});

test('invalid date format is rejected', () => {
  assert.throws(() =>
    filterDeadlines([{ id: 'x', moduleId: 'CS3202', date: '14/11/2026' }]));
});
