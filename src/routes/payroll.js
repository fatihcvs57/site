const express = require('express');
const { getDb } = require('../db');
const { roleRequired } = require('../middleware/auth');
const router = express.Router();

router.post('/pay', roleRequired('owner', 'admin'), async (req, res) => {
  const { employee_id, amount, note } = req.body;
  const db = await getDb();
  await db.run('INSERT INTO payroll (employee_id, amount, note, paid_at) VALUES (?,?,?,CURRENT_TIMESTAMP)', [employee_id, amount, note]);
  res.json({ ok: true });
});

router.get('/history/:employee_id', async (req, res) => {
  const db = await getDb();
  const rows = await db.all('SELECT * FROM payroll WHERE employee_id=? ORDER BY paid_at DESC', req.params.employee_id);
  res.json(rows);
});

module.exports = router;
