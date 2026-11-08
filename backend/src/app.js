import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import deadlineRoutes from './routes/deadlineRoutes.js';
import { getModules } from './controllers/deadlineController.js';

const app = express();

const PORT = process.env.PORT || 5030;
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.disable('x-powered-by');
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json({ limit: '16kb' }));

app.get('/', (req, res) => {
  res.json({ message: 'SDCS Backend is running!' });
});

app.use('/api/deadlines', deadlineRoutes);
app.get('/api/modules', getModules);

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500
    ? error.status
    : 500;
  const message = error.type === 'entity.parse.failed'
    ? 'Invalid JSON body'
    : status < 500 ? 'Invalid request' : 'Internal server error';

  res.status(status).json({ error: message });
});

// Local development only (Sprint 1 sample-data prototype)
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
