const app = require('./app')

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  console.log(`🚀 Server rodando em ${address}`)
})
