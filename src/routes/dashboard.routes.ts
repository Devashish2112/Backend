import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';
import { requireViewer, requireAnalyst } from '../middleware/authorization';
import { validate } from '../middleware/validation';
import { dashboardQuerySchema, trendsQuerySchema } from '../utils/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Summary (All roles)
router.get(
  '/summary',
  requireViewer,
  validate(dashboardQuerySchema, 'query'),
  dashboardController.getSummary
);

// Trends (Analyst and Admin)
router.get(
  '/trends',
  requireAnalyst,
  validate(trendsQuerySchema, 'query'),
  dashboardController.getTrends
);

export default router;
