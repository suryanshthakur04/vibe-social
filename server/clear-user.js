const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true }
});

const clearOldUser = async () => {
  try {
    const res = await pool.query("DELETE FROM users WHERE email = 'suryathakur5002@gmail.com'");
    console.log('Deleted old Thunder Client test rows:', res.rowCount);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
};

clearOldUser();
