// db/pool.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION || "postgresql://bughunter:do%20hacking@localhost:5432/inventory_app"
});

module.exports = pool;
