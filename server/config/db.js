const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

pool.connect((err) => {
  if (err) {
    console.error('Neon Database connection error', err.stack);
  } else {
    console.log('Connected to Neon PostgreSQL successfully! 🚀');
  }
});

// CRITICAL FIX: Neon aggressive scaling drops idle TCP connections unconditionally.
// If this isn't caught, Node.js throws a FATAL Unhandled Exception and crashes the entire backend.
// This simply logs the drop and allows pg.Pool to reconnect seamlessly.
pool.on('error', (err, client) => {
  console.error('Unexpected idle connection drop from Neon Backend:', err.message);
});

module.exports = pool;
