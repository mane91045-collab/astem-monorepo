const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'astem_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    // Use a short connection timeout so the fallback logic in controllers
    // fires quickly when no database is available.
    connectionTimeoutMillis: 3000,
});

module.exports = pool;
