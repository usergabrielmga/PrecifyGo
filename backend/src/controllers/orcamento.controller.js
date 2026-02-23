const OrcamentoService = require('../services/orcamento.service')

class OrcamentoController {
  static async create(request, reply) {
      console.log('Dados recebidos no controller:', request.body);
    try {
      const result = await OrcamentoService.create(request.body)
      return reply.code(201).send(result)
    } catch (error) {
      return reply.code(400).send({ error: error.message })
    }
  }

  
  static async getAll(request, reply) {
    try {
      const orcamentos = await OrcamentoService.getAll()
      return reply.send(orcamentos)
    } catch (error) {
      console.error(error)
      return reply.status(500).send({ message: 'Erro ao buscar orçamentos' })
    }
  }

  static async get(request, reply) {
  try {
    const { id } = request.params

    const budget = await OrcamentoService.getById(id)

    return reply.code(200).send(budget)
  } catch (error) {
    return reply.code(404).send({ error: error.message })
  }
}



  static async delete(request, reply) {
  try {
    const { id } = request.params;
    await ClientesService.delete(Number(id));
    return reply.code(204).send();
  } catch (error) {
    return reply.code(400).send({ error: error.message });
  }
}

  static async pdf(request, reply) {
  try {
    const { id } = request.params

    const pdfBuffer = await OrcamentoService.generatePdf(id)

    reply
      .header('Content-Type', 'application/pdf')
      .header(
        'Content-Disposition',
        `attachment; filename=orcamento-${id}.pdf`
      )
      .send(pdfBuffer)

  } catch (error) {
    reply.code(404).send({ error: error.message })
  }
}

static async viewPdf(request, reply) {
  try {
    const { id } = request.params
    const pdfBuffer = await OrcamentoService.generatePdf(id)

    
    reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `inline; filename=orcamento-${id}.pdf`)
      .send(pdfBuffer)

  } catch (error) {
    reply.code(404).send({ error: error.message })
  }
}

}

module.exports = OrcamentoController
