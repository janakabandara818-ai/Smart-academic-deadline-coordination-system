# Backend prototype

The Sprint 1 backend uses labelled sample fixtures, with three modules and five
deadlines. It does not connect to live Moodle or require credentials.

Install Bun and Node.js (validated with Bun 1.4.4 and Node 24.22.0), then run from
the repository root:

```bash
cd backend
bun install
bun run start
```

The API listens on `http://127.0.0.1:5030`. For automatic restarts during development,
use `bun run dev` instead. Stop the server with Ctrl+C.

Configuration is optional: copy `backend/.env.example` to `backend/.env` and set
`PORT` or `FRONTEND_ORIGIN`. Defaults are `5030` and `http://localhost:5173`.
Run backend commands from `backend/` so dotenv can load that file. Keep `.env`
and credentials out of Git.

With the server running, use another terminal to check the API:

```bash
curl http://127.0.0.1:5030/api/modules
curl http://127.0.0.1:5030/api/deadlines
curl 'http://127.0.0.1:5030/api/deadlines?moduleId=EE2101'
```

Module IDs are `CS3202`, `EE2101` and `SE3205`. Deadline responses contain
`source`, `moduleId`, `count` and `deadlines`. Omit `moduleId` or use `all` for
all records; an unknown ID returns an empty array with count 0. Empty, repeated
or bracketed `moduleId` parameters select all records. Module IDs accept
surrounding whitespace and case differences; the `all` keyword accepts case
differences but must have no surrounding whitespace.

Malformed JSON returns HTTP 400 with a safe JSON error. Other request-parser
errors retain their HTTP status without exposing internal error details. JSON
bodies are limited to 16 KB. Unsupported routes and methods return HTTP 404.

Run the existing automated checks from `backend/`:

```bash
bun run test
bun test tests/deadlineService.test.js
```

The first command runs the package test script using Node; the second explicitly
runs all five service tests with Bun. No lint script is configured. See
[the backend QA report](../qa/SADC-57/backend/REPORT.md) for API regression commands
and empty-dataset HTTP coverage.
