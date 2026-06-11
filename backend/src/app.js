require('dotenv').config()

const fastify = require('fastify')({
  logger: true
})

const cors = require('@fastify/cors')

// CORS
fastify.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

// JWT
fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET || 'supersecret'
})

fastify.register(require('@fastify/multipart'))

fastify.register(require('./middlewares/auth.middleware'))

// Rotas
fastify.register(require('./routes'))

module.exports = fastify