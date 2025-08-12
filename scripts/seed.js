require('dotenv').config();
const bcrypt = require('bcryptjs');
const { getDb } = require('../src/db');

(async () => {
  const db = await getDb();
  const hash = await bcrypt.hash('admin123', 10);
  await db.run('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)', ['Admin', 'admin@partshop.local', hash, 'owner']);
  await db.run('INSERT INTO items (sku, name, buy_price, sell_price, stock, supplier) VALUES (?,?,?,?,?,?)', ['ABC123', 'Vida', 1, 2, 10, 'Tedarikci']);
  await db.run('INSERT INTO items (sku, name, buy_price, sell_price, stock, supplier) VALUES (?,?,?,?,?,?)', ['XYZ456', 'Somun', 2, 4, 5, 'Tedarikci']);
  await db.run('INSERT INTO customers (name, phone, email, address) VALUES (?,?,?,?)', ['Musteri', '5550000', 'cust@example.com', 'Adres']);
  await db.run('INSERT INTO employees (name, phone, salary, start_date) VALUES (?,?,?,?)', ['Calisan', '5551111', 5000, '2023-01-01']);
  console.log('Seed complete');
})();
