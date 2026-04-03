import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/authorization';
import { validate } from '../middleware/validation';
import {
  createUserSchema,
  updateUserSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  uuidSchema,
  paginationSchema,
} from '../utils/validation';

const router = Router();

// All user management routes require authentication and admin role
router.use(authenticate, requireAdmin);

router.post('/', validate(createUserSchema), userController.createUser);
router.get('/', validate(paginationSchema, 'query'), userController.getUsers);
router.get('/:id', validate(uuidSchema, 'params'), userController.getUserById);
router.put('/:id', validate(uuidSchema, 'params'), validate(updateUserSchema), userController.updateUser);
router.patch('/:id/role', validate(uuidSchema, 'params'), validate(updateUserRoleSchema), userController.updateUserRole);
router.patch('/:id/status', validate(uuidSchema, 'params'), validate(updateUserStatusSchema), userController.updateUserStatus);

export default router;
