const db = require('../config/database')

exports.createLocal = async ({ name, email, password }) => {
  const result = await db.query(
    `
    INSERT INTO users
    (name, email, password, provider)
    VALUES ($1, $2, $3, $4)
    RETURNING id
    `,
    [name, email, password, 'local']
  )

  return result.rows[0].id
}

exports.findByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )

  return result.rows[0]
}

exports.createGoogle = async ({ nome, email, googleId }) => {
  const result = await db.query(
    `
    INSERT INTO users
    (name, email, google_id, provider)
    VALUES ($1, $2, $3, $4)
    RETURNING id
    `,
    [nome, email, googleId, 'google']
  )

  return result.rows[0].id
}

exports.linkGoogle = async (userId, googleId) => {
  await db.query(
    `
    UPDATE users
    SET google_id = $1
    WHERE id = $2
    `,
    [googleId, userId]
  )
}