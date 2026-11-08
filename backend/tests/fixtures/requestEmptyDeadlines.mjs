import { registerHooks } from 'node:module';
import express from 'express';

const repositoryUrl = new URL('../../src/repositories/deadlineRepository.js', import.meta.url).href;
const emptyRepositoryUrl = new URL('./emptyDeadlineRepository.mjs', import.meta.url).href;

// Confine the repository replacement to this child process and this exact module.
registerHooks({
  resolve(specifier, context, nextResolve) {
    const resolved = nextResolve(specifier, context);
    return resolved.url === repositoryUrl
      ? { ...resolved, url: emptyRepositoryUrl }
      : resolved;
  }
});

const { findAllDeadlines } = await import(repositoryUrl);
const { default: deadlineRoutes } = await import('../../src/routes/deadlineRoutes.js');
const app = express();
app.use('/api/deadlines', deadlineRoutes);
const server = app.listen(0, '127.0.0.1');

try {
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const url = `http://127.0.0.1:${server.address().port}/api/deadlines`;
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    repositoryCount: findAllDeadlines().length,
    method: 'GET',
    url,
    status: response.status,
    contentType: response.headers.get('content-type'),
    body: await response.json()
  }));
} finally {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}
