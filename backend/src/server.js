const app = require('./app')

const start = async () => {
  try {
    await app.listen({
      port: process.env.PORT || 3000,
      host: '0.0.0.0' 
    })

    console.log('Server rodando com sucesso!')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()