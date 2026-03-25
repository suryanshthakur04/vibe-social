const { Pool } = require('pg');

const pool = new Pool({
  // Paste your actual Neon string right here inside the quotes
  connectionString: 'postgresql://neondb_owner:npg_r3x9vPJZGOMV@ep-dawn-unit-a17ro3lg-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    require: true,
  },
});

pool.connect((err) => {
  if (err) throw err;
  console.log('Connected to Neon PostgreSQL successfully! 🚀');
});

module.exports = pool;