import { findAllDeadlines, findAllModules } from '../repositories/deadlineRepository.js';
import { filterDeadlines } from '../services/deadlineService.js';
import { SAMPLE_DATA_LABEL } from '../fixtures/sampleData.js';

// GET /api/deadlines            → all modules
// GET /api/deadlines?moduleId=X → one module (empty list = empty state)
export function getDeadlines(req, res) {
  const moduleId =
    typeof req.query.moduleId === 'string' ? req.query.moduleId : 'all';

  try {
    const deadlines = filterDeadlines(findAllDeadlines(), moduleId);
    return res.status(200).json({
      source: SAMPLE_DATA_LABEL,
      moduleId,
      count: deadlines.length,
      deadlines
    });
  } catch (error) {
    console.error('Failed to filter deadlines:', error);
    return res.status(500).json({ error: 'Unable to retrieve deadlines' });
  }
}

// GET /api/modules → module list (Planner dropdown, Dashboard count)
export function getModules(req, res) {
  return res.status(200).json({
    source: SAMPLE_DATA_LABEL,
    modules: findAllModules()
  });
}
