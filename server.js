require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { authRequired } = require('./src/middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/items', authRequired, require('./src/routes/items'));
app.use('/api/customers', authRequired, require('./src/routes/customers'));
app.use('/api/employees', authRequired, require('./src/routes/employees'));
app.use('/api/payroll', authRequired, require('./src/routes/payroll'));
app.use('/api/sales', authRequired, require('./src/routes/sales'));
app.use('/api/reports', authRequired, require('./src/routes/reports'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
