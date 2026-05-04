import { Router } from 'express';
import authRoutes from './auth.routes.js';
import holidayRoutes from './holiday.routes.js';
import adminRoutes from './admin.routes.js';

export function createApiRouter(deps = {}) {
  const router = Router();

  router.use('/auth', authRoutes(deps));
  router.use('/holidays', holidayRoutes(deps));
  router.use('/admin', adminRoutes(deps));

  return router;
}

export default createApiRouter;
