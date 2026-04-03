import { Router } from 'express';
import recordsController from '../controllers/records.controller';
import { authenticate } from '../middleware/auth';
import { requireAnalyst, requireAdmin, requireViewer } from '../middleware/authorization';
import { validate } from '../middleware/validation';
import {
  createRecordSchema,
  updateRecordSchema,
  recordFilterSchema,
  paginationSchema,
  uuidSchema,
} from '../utils/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create record (Analyst and Admin)
router.post('/', requireAnalyst, validate(createRecordSchema), recordsController.createRecord);

// Get all records (All roles, with filtering)
router.get(
  '/',
  requireViewer,
  validate(recordFilterSchema, 'query'),
  validate(paginationSchema, 'query'),
  recordsController.getRecords
);

// Get single record (All roles, ownership checked in service)
router.get('/:id', requireViewer, validate(uuidSchema, 'params'), recordsController.getRecordById);

// Update record (Analyst can update own, Admin can update all)
router.put(
  '/:id',
  requireAnalyst,
  validate(uuidSchema, 'params'),
  validate(updateRecordSchema),
  recordsController.updateRecord
);

// Delete record (Admin only)
router.delete('/:id', requireAdmin, validate(uuidSchema, 'params'), recordsController.deleteRecord);

export default router;
