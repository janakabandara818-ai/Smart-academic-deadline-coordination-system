import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SAMPLE_DATA_LABEL } from '../src/fixtures/sampleData.js';

test('B-09: GET /api/deadlines returns HTTP 200 when the entire repository is empty', (t) => {
  // Node's module hook isolates the mock from other tests and production fixtures.
  const output = execFileSync('node', [
    fileURLToPath(new URL('./fixtures/requestEmptyDeadlines.mjs', import.meta.url))
  ], { encoding: 'utf8', timeout: 10000 });
  const actual = JSON.parse(output);

  assert.equal(actual.repositoryCount, 0);
  assert.equal(actual.method, 'GET');
  assert.equal(new URL(actual.url).pathname, '/api/deadlines');
  assert.equal(new URL(actual.url).search, '');
  assert.equal(actual.status, 200);
  assert.match(actual.contentType, /^application\/json\b/);
  assert.deepEqual(actual.body, {
    source: SAMPLE_DATA_LABEL,
    moduleId: 'all',
    count: 0,
    deadlines: []
  });
  t.diagnostic(JSON.stringify(actual));
});
