import { Router } from 'express';

export function createAdminRoutes() {
  const router = Router();

  router.get('/reports', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

  return router;
}

export default createAdminRoutes;
