const OrcamentoService = require('../services/orcamento.service')

class OrcamentoController {

  // ================= CRIAR ORÇAMENTO =================

  static async create(request, reply) {
    const usuarioId = request.user.id

    try {
      console.log('Dados recebidos no controller:', request.body)

      const result = await OrcamentoService.create(
        request.body,
        usuarioId
      )

      return reply.code(201).send(result)

    } catch (error) {
      console.error(error)

      return reply.code(400).send({
        error: error.message
      })
    }
  }

  // ================= LISTAR ORÇAMENTOS =================

  static async getAll(request, reply) {
    const usuarioId = request.user.id

    try {
      const orcamentos = await OrcamentoService.getAll(usuarioId)

      return reply.send(orcamentos)

    } catch (error) {
      console.error(error)

      return reply.code(500).send({
        message: 'Erro ao buscar orçamentos'
      })
    }
  }

  // ================= BUSCAR POR ID =================

  static async get(request, reply) {
    try {
      const { id } = request.params

      const budget = await OrcamentoService.getById(id)

      return reply.code(200).send(budget)

    } catch (error) {
      return reply.code(404).send({
        error: error.message
      })
    }
  }

  // ================= ATUALIZAR STATUS =================

  static async updateStatus(request, reply) {
    const usuarioId = request.user.id

    try {
      const { id } = request.params
      const { status } = request.body

      if (!status) {
        return reply.code(400).send({
          error: 'O status é obrigatório'
        })
      }

      const result = await OrcamentoService.updateStatus(
        Number(id),
        status,
        usuarioId
      )

      return reply.code(200).send({
        message: result.message,
        numero_orcamento: Number(id),
        status: result.status
      })

    } catch (error) {
      console.error('Erro ao atualizar status:', error)

      return reply.code(400).send({
        error: error.message
      })
    }
  }

  // ================= EXCLUIR ORÇAMENTO =================

  static async delete(request, reply) {
    try {
      const { id } = request.params
      const usuarioId = request.user.id

      await OrcamentoService.delete(
        Number(id),
        usuarioId
      )

      return reply.code(204).send()

    } catch (error) {
      return reply.code(400).send({
        error: error.message
      })
    }
  }

  // ================= BAIXAR PDF =================

  static async pdf(request, reply) {
    try {
      const { id } = request.params

      if (!id || id === 'undefined') {
        return reply.code(400).send({
          error: 'ID inválido'
        })
      }

      const pdfBuffer = await OrcamentoService.generatePdf(Number(id))

      return reply
        .header('Content-Type', 'application/pdf')
        .header(
          'Content-Disposition',
          `attachment; filename=orcamento-${id}.pdf`
        )
        .send(pdfBuffer)

    } catch (error) {
      return reply.code(404).send({
        error: error.message
      })
    }
  }

  // ================= VISUALIZAR PDF =================

  static async viewPdf(request, reply) {
    try {
      const { id } = request.params

      if (!id || id === 'undefined') {
        return reply.code(400).send({
          error: 'ID do orçamento inválido'
        })
      }

      const pdfBuffer = await OrcamentoService.generatePdf(Number(id))

      return reply
        .header('Content-Type', 'application/pdf')
        .header(
          'Content-Disposition',
          `inline; filename=orcamento-${id}.pdf`
        )
        .send(pdfBuffer)

    } catch (error) {
      return reply.code(404).send({
        error: error.message
      })
    }
  }
}

module.exports = OrcamentoController