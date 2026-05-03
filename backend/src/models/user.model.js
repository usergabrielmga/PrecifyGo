const db = require('../config/database')

exports.createLocal = async ({ name, email, password }) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password, provider) VALUES (?, ?, ?, ?)',
    [name, email, password, 'local']
  )
  return result.insertId
}

exports.createGoogle = async ({ name, email, googleId }) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, google_id, provider) VALUES (?, ?, ?, ?)',
    [name ?? null, email, googleId, 'google']
  )
  return result.insertId
}

exports.findByEmail = async (email) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  )
  return rows[0]
}

exports.linkGoogle = async (userId, googleId) => {
  await db.execute(
    'UPDATE users SET google_id = ?, provider = ? WHERE id = ?',
    [googleId, 'google', userId]
  )
}
