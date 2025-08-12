const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let dbPromise;

async function getDb() {
  if (!dbPromise) {
    const filename = process.env.DB_FILE || path.join(__dirname, '..', 'data.sqlite');
    dbPromise = open({ filename, driver: sqlite3.Database });
    const db = await dbPromise;
    await db.exec('PRAGMA foreign_keys = ON');
  }
  return dbPromise;
}

module.exports = { getDb };
