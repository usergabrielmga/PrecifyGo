require('dotenv').config()

const fastify = require('fastify')({
  logger: true
})

const cors = require('@fastify/cors')

// 🔹 CORS (antes das rotas)
fastify.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})

// 🔹 JWT
fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET || 'supersecret'
})

// 🔹 Rotas
fastify.register(require('./routes'))

module.exports = fastify
