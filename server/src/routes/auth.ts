import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  const { email } = req.body;
  // demo login
  res.json({ token: 'demo-token', user: { id: 1, email, role: 'admin' } });
});

router.post('/register', (req, res) => {
  res.json({ ok: true });
});

export default router;
