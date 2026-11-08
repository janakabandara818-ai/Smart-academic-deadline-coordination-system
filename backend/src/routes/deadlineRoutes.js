import { Router } from 'express';
import { getDeadlines } from '../controllers/deadlineController.js';

const router = Router();

router.get('/', getDeadlines);

export default router;
