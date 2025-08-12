const express = require('express');
const { getDb } = require('../db');
const router = express.Router();

router.get('/dashboard', async (req, res) => {
  const db = await getDb();
  const daily = await db.get("SELECT COALESCE(SUM(total),0) as total FROM sales WHERE DATE(created_at)=DATE('now')");
  const stock = await db.get('SELECT COALESCE(SUM(stock*buy_price),0) as value FROM items');
  const low = await db.all('SELECT * FROM items WHERE stock<=3 ORDER BY stock ASC LIMIT 20');
  res.json({ daily_sales: daily.total, stock_value: stock.value, low_stock: low });
});

module.exports = router;
