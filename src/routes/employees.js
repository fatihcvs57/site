const express = require('express');
const { getDb } = require('../db');
const { roleRequired } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = await getDb();
  const rows = await db.all('SELECT * FROM employees');
  res.json(rows);
});

router.post('/', roleRequired('owner', 'admin'), async (req, res) => {
  const { name, phone, salary, start_date, end_date } = req.body;
  const db = await getDb();
  const result = await db.run('INSERT INTO employees (name, phone, salary, start_date, end_date) VALUES (?,?,?,?,?)', [name, phone, salary, start_date, end_date]);
  res.json({ id: result.lastID });
});

router.put('/:id', roleRequired('owner', 'admin'), async (req, res) => {
  const { id } = req.params;
  const { name, phone, salary, start_date, end_date } = req.body;
  const db = await getDb();
  await db.run('UPDATE employees SET name=?, phone=?, salary=?, start_date=?, end_date=? WHERE id=?', [name, phone, salary, start_date, end_date, id]);
  res.json({ ok: true });
});

router.delete('/:id', roleRequired('owner'), async (req, res) => {
  const db = await getDb();
  await db.run('DELETE FROM employees WHERE id=?', req.params.id);
  res.json({ ok: true });
});

module.exports = router;
