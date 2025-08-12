const fs = require('fs');
require('dotenv').config();
const { getDb } = require('../src/db');

(async () => {
  const db = await getDb();
  const schema = fs.readFileSync('sql/schema.sql', 'utf8');
  await db.exec(schema);
  console.log('Migration complete');
})();
