import { Router } from 'express';
import authRoutes from './auth.routes.js';
import holidayRoutes from './holiday.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/holidays', holidayRoutes);
router.use('/admin', adminRoutes);

export default router;
