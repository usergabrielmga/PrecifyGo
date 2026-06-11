require('dotenv').config()

const { Pool } = require('pg')

const isProduction = process.env.NODE_ENV === 'production'


const pool = new Pool({
  connectionString: process.env.DATABASE_URL_SHINKANSEN,
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false
})

;(async () => {
  try {
    await pool.query('SELECT 1')
    console.log('✅ Banco conectado!')
  } catch (err) {
    console.error('❌ ERRO REAL:', err)
  }
})()

module.exports = pool