require('dotenv').config()

const fastify = require('fastify')({
  logger: true
})

const cors = require('@fastify/cors')

// CORS
fastify.register(cors, {
  origin: true, // permite qualquer origem em produção
})

// JWT
fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET || 'supersecret'
})

fastify.register(require('@fastify/multipart'))

// Rotas
fastify.register(require('./routes'))

module.exports = fastify;