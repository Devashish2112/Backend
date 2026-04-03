import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import recordsRoutes from './records.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Finance Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/records', recordsRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
