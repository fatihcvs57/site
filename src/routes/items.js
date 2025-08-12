const express = require('express');
const { getDb } = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = await getDb();
  const items = await db.all('SELECT * FROM items');
  res.json(items);
});

router.post('/', async (req, res) => {
  const { sku, name, buy_price, sell_price, stock, supplier } = req.body;
  const db = await getDb();
  try {
    const result = await db.run('INSERT INTO items (sku, name, buy_price, sell_price, stock, supplier) VALUES (?,?,?,?,?,?)', [sku, name, buy_price, sell_price, stock, supplier]);
    res.json({ id: result.lastID });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { sku, name, buy_price, sell_price, stock, supplier } = req.body;
  const db = await getDb();
  try {
    await db.run('UPDATE items SET sku=?, name=?, buy_price=?, sell_price=?, stock=?, supplier=? WHERE id=?', [sku, name, buy_price, sell_price, stock, supplier, id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const db = await getDb();
  await db.run('DELETE FROM items WHERE id=?', req.params.id);
  res.json({ ok: true });
});

module.exports = router;
