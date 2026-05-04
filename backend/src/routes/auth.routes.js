import { Router } from 'express';

const router = Router();

router.post('/login', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.post('/register', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

export default router;
