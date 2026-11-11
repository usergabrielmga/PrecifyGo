
const ServicoModel = require("../models/servicos.model");

function obterUsuarioId(request) {
  const id = Number(request.user?.id);

  return Number.isInteger(id) && id > 0 ? id : null;
}

function obterIdServico(request) {
  const id = Number(request.params.id);

  return Number.isInteger(id) && id > 0 ? id : null;
}

function validarServico(body) {
  const {
    nome,
    descricao,
    preco,
    ativo
  } = body || {};

  if (
    typeof nome !== "string" ||
    !nome.trim() ||
    preco === undefined
  ) {
    return "Nome e preço são obrigatórios";
  }

  if (
    !Number.isFinite(Number(preco)) ||
    Number(preco) < 0
  ) {
    return "Preço inválido";
  }

  if (
    ativo !== undefined &&
    typeof ativo !== "boolean"
  ) {
    return "O campo ativo deve ser booleano";
  }

  if (
    descricao !== undefined &&
    descricao !== null &&
    typeof descricao !== "string"
  ) {
    return "Descrição inválida";
  }

  return null;
}

class ServicoController {

  static async listar(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      const servicos = await ServicoModel.listar(usuarioId);

      return reply.send(servicos);

    } catch (error) {
      console.error("Erro ao listar serviços:", error);

      return reply.code(500).send({
        error: "Erro ao listar serviços"
      });
    }
  }

  static async buscarPorId(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);
      const id = obterIdServico(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      if (!id) {
        return reply.code(400).send({
          error: "ID do serviço inválido"
        });
      }

      const servico = await ServicoModel.buscarPorId(
        id,
        usuarioId
      );

      if (!servico) {
        return reply.code(404).send({
          error: "Serviço não encontrado"
        });
      }

      return reply.send(servico);

    } catch (error) {
      console.error("Erro ao buscar serviço:", error);

      return reply.code(500).send({
        error: "Erro ao buscar serviço"
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

      const erro = validarServico(request.body);

      if (erro) {
        return reply.code(400).send({ error: erro });
      }

      const {
        nome,
        descricao,
        preco,
        ativo
      } = request.body;

      const servico = await ServicoModel.criar({
        nome: nome.trim(),
        descricao,
        preco: Number(preco),
        ativo: ativo ?? true,
        usuarioId
      });

      return reply.code(201).send(servico);

    } catch (error) {
      console.error("Erro ao criar serviço:", error);

      return reply.code(500).send({
        error: "Erro ao criar serviço"
      });
    }
  }

  static async atualizar(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);
      const id = obterIdServico(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      if (!id) {
        return reply.code(400).send({
          error: "ID do serviço inválido"
        });
      }

      const erro = validarServico(request.body);

      if (erro) {
        return reply.code(400).send({ error: erro });
      }

      const {
        nome,
        descricao,
        preco,
        ativo
      } = request.body;

      const servico = await ServicoModel.atualizar(id, {
        nome: nome.trim(),
        descricao,
        preco: Number(preco),
        ativo: ativo ?? true,
        usuarioId
      });

      if (!servico) {
        return reply.code(404).send({
          error: "Serviço não encontrado"
        });
      }

      return reply.send(servico);

    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);

      return reply.code(500).send({
        error: "Erro ao atualizar serviço"
      });
    }
  }

  static async excluir(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);
      const id = obterIdServico(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      if (!id) {
        return reply.code(400).send({
          error: "ID do serviço inválido"
        });
      }

      const servico = await ServicoModel.excluir(id, usuarioId);

      if (!servico) {
        return reply.code(404).send({
          error: "Serviço não encontrado"
        });
      }

      return reply.send({
        message: "Serviço excluído com sucesso",
        servico
      });

    } catch (error) {
      if (error.code === "23503") {
        return reply.code(409).send({
          error: "Este serviço está vinculado a um orçamento e não pode ser excluído."
        });
      }

      console.error("Erro ao excluir serviço:", error);

      return reply.code(500).send({
        error: "Erro ao excluir serviço"
      });
    }
  }
}

module.exports = ServicoController;
