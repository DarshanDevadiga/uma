const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

console.log('Database Configuration Diagnostics:');
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  PASSWORD_SET: !!process.env.DB_PASSWORD,
  PASSWORD_LENGTH: process.env.DB_PASSWORD?.length || 0
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'uma_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 5000 // 5 seconds connection timeout
});

// Helper to execute query
const query = async (sql, params) => {
  const [results] = await pool.execute(sql, params);
  return results;
};

module.exports = {
  pool,
  query
};
