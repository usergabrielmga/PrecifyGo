const db = require('../config/database')

exports.createLocal = async ({ nome, email, senha }) => {
  const [result] = await db.execute(
    'INSERT INTO users (nome, email, senha, provider) VALUES (?, ?, ?, ?)',
    [nome, email, senha, 'local']
  )
  return result.insertId
}

exports.createGoogle = async ({ nome, email, googleId }) => {
  const [result] = await db.execute(
    'INSERT INTO users (nome, email, google_id, provider) VALUES (?, ?, ?, ?)',
    [nome ?? null, email, googleId, 'google']
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
