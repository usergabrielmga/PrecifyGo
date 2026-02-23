const OrcamentoPublicoService = require('../services/orcamentoPublico.service')

class OrcamentoPublicoController {

  static async getByToken(request, reply) {
    try {
      const { token } = request.params

      const orcamento =
        await OrcamentoPublicoService.getByToken(token)

      return reply.code(200).send(orcamento)
    } catch (error) {
      return reply.code(404).send({
        error: error.message
      })
    }
  }

  static async responder(request, reply) {
    try {
      const { token } = request.params
      const { status } = request.body

      await OrcamentoPublicoService.responder(token, status)

      return reply.code(200).send({
        message: 'Resposta registrada com sucesso'
      })
    } catch (error) {
      return reply.code(400).send({
        error: error.message
      })
    }
  }

}

module.exports = OrcamentoPublicoController
