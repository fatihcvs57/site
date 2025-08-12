const express = require('express');
const { getDb } = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = await getDb();
  const rows = await db.all('SELECT * FROM customers');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { name, phone, email, address } = req.body;
  const db = await getDb();
  const result = await db.run('INSERT INTO customers (name, phone, email, address) VALUES (?,?,?,?)', [name, phone, email, address]);
  res.json({ id: result.lastID });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address } = req.body;
  const db = await getDb();
  await db.run('UPDATE customers SET name=?, phone=?, email=?, address=? WHERE id=?', [name, phone, email, address, id]);
  res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  const db = await getDb();
  await db.run('DELETE FROM customers WHERE id=?', req.params.id);
  res.json({ ok: true });
});

module.exports = router;
