const { uploadLogo } = require('../controllers/logo.controller');

async function logoRoutes(fastify, options) {
  fastify.post('/upload-logo', uploadLogo);
}

module.exports = logoRoutes;