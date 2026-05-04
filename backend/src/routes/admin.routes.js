import { Router } from 'express';

const router = Router();

router.get('/reports', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

export default router;
