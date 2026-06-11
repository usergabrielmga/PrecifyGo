const ClientesService = require('../services/clientes.service')

class ClienteController {
  static async create(request, reply) {
    const usuarioId = request.user.id;
  try {
    const clienteId = await ClientesService.createCliente(request.body, usuarioId)
    return reply.code(201).send({ clienteId })
  } catch (error) {
    return reply.code(400).send({ error: error.message })
  }
}

  static async getAll(request, reply) {
    const usuarioId = request.user.id;
    try {
      const result = await ClientesService.getAll(usuarioId)
      return reply.code(200).send(result)
    } catch (error) {
      return reply.code(400).send({ error: error.message })
    }
  }

  static async edit(request, reply) {
    const usuarioId = request.user.id;
    try {
      const { id } = request.params
      const data = request.body

      if (!data || Object.keys(data).length === 0) {
        return reply
          .code(400)
          .send({ error: 'Nenhum dado enviado para atualização' })
      }

      await ClientesService.edit(id, data, usuarioId)

      return reply.code(200).send({
        message: 'Cliente atualizado com sucesso'
      })
    } catch (error) {
      return reply.code(400).send({ error: error.message })
    }
  }

  static async delete(request, reply) {
    const usuarioId = request.user.id;
    try {
      const { id } = request.params;
      await ClientesService.delete(Number(id), usuarioId);
      return reply.code(204).send();
    } catch (error) {

  if (
    error.message ===
    'CLIENTE_COM_ORCAMENTOS'
  ) {
    return reply.code(409).send({
      error:
        'Não é possível excluir o cliente porque ele possui orçamentos vinculados.'
    })
  }

  return reply.code(400).send({
    error: error.message
  })
}

  
}

}

module.exports = ClienteController
