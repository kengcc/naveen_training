import { Router } from 'express';

export function createAuthRoutes() {
  const router = Router();

  router.post('/login', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
  router.post('/register', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

  return router;
}

export default createAuthRoutes;
