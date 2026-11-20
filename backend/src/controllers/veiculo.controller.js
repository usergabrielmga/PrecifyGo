
const VeiculosService = require("../services/veiculos.service");

function obterUsuarioId(request) {
  const id = Number(request.user?.id);

  return Number.isInteger(id) && id > 0 ? id : null;
}

function obterId(request) {
  const id = Number(request.params.id);

  return Number.isInteger(id) && id > 0 ? id : null;
}

class VeiculoController {

  static async listar(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      const clienteId = request.query.clienteId
        ? Number(request.query.clienteId)
        : null;

      if (
        clienteId !== null &&
        (!Number.isInteger(clienteId) || clienteId <= 0)
      ) {
        return reply.code(400).send({
          error: "ID do cliente inválido"
        });
      }

      const veiculos = await VeiculosService.listar(
        usuarioId,
        clienteId
      );

      return reply.send(veiculos);

    } catch (error) {
      console.error("Erro ao listar veículos:", error);

      return reply.code(500).send({
        error: "Erro ao listar veículos"
      });
    }
  }

  static async buscarPorId(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);
      const id = obterId(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      if (!id) {
        return reply.code(400).send({
          error: "ID do veículo inválido"
        });
      }

      const veiculo = await VeiculosService.buscarPorId(
        id,
        usuarioId
      );

      if (!veiculo) {
        return reply.code(404).send({
          error: "Veículo não encontrado"
        });
      }

      return reply.send(veiculo);

    } catch (error) {
      console.error("Erro ao buscar veículo:", error);

      return reply.code(500).send({
        error: "Erro ao buscar veículo"
      });
    }
  }

  static async criar(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      const veiculo = await VeiculosService.criar(
        request.body,
        usuarioId
      );

      return reply.code(201).send(veiculo);

    } catch (error) {
      if (error.code === "23505") {
        return reply.code(409).send({
          error: "Já existe um veículo cadastrado com essa placa."
        });
      }

      if (error.code === "23503") {
        return reply.code(400).send({
          error: "Cliente não encontrado ou não pertence à sua conta."
        });
      }

      return reply.code(400).send({
        error: error.message || "Erro ao cadastrar veículo"
      });
    }
  }

  static async atualizar(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);
      const id = obterId(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      if (!id) {
        return reply.code(400).send({
          error: "ID do veículo inválido"
        });
      }

      const veiculo = await VeiculosService.atualizar(
        id,
        request.body,
        usuarioId
      );

      if (!veiculo) {
        return reply.code(404).send({
          error: "Veículo não encontrado"
        });
      }

      return reply.send(veiculo);

    } catch (error) {
      if (error.code === "23505") {
        return reply.code(409).send({
          error: "Já existe um veículo cadastrado com essa placa."
        });
      }

      if (error.code === "23503") {
        return reply.code(400).send({
          error: "Cliente não encontrado ou não pertence à sua conta."
        });
      }

      return reply.code(400).send({
        error: error.message || "Erro ao atualizar veículo"
      });
    }
  }

  static async excluir(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);
      const id = obterId(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      if (!id) {
        return reply.code(400).send({
          error: "ID do veículo inválido"
        });
      }

      const veiculo = await VeiculosService.excluir(
        id,
        usuarioId
      );

      if (!veiculo) {
        return reply.code(404).send({
          error: "Veículo não encontrado"
        });
      }

      return reply.send({
        message: "Veículo excluído com sucesso",
        veiculo
      });

    } catch (error) {
      if (error.code === "23503") {
        return reply.code(409).send({
          error: "Este veículo possui orçamentos vinculados e não pode ser excluído."
        });
      }

      console.error("Erro ao excluir veículo:", error);

      return reply.code(500).send({
        error: "Erro ao excluir veículo"
      });
    }
  }
}

module.exports = VeiculoController;
