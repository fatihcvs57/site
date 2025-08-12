const express = require('express');
const { getDb } = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { customer_id, items, payment_method } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: 'No items' });
  const db = await getDb();
  try {
    await db.run('BEGIN');
    const total = items.reduce((s, it) => s + it.qty * it.price, 0);
    const sale = await db.run('INSERT INTO sales (customer_id, payment_method, total, created_at) VALUES (?,?,?,CURRENT_TIMESTAMP)', [customer_id || null, payment_method, total]);
    const saleId = sale.lastID;
    for (const it of items) {
      await db.run('INSERT INTO sale_items (sale_id, item_id, qty, price) VALUES (?,?,?,?)', [saleId, it.item_id, it.qty, it.price]);
      await db.run('UPDATE items SET stock = stock - ? WHERE id = ?', [it.qty, it.item_id]);
    }
    await db.run('COMMIT');
    res.json({ id: saleId });
  } catch (err) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const db = await getDb();
  const sales = await db.all('SELECT * FROM sales ORDER BY created_at DESC LIMIT 100');
  for (const s of sales) {
    s.items = await db.all('SELECT item_id, qty, price FROM sale_items WHERE sale_id=?', s.id);
  }
  res.json(sales);
});

module.exports = router;
