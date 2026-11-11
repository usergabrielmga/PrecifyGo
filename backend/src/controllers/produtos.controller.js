
const ProdutoModel = require("../models/produtos.model");

function obterUsuarioId(request) {
  const id = Number(request.user?.id);

  return Number.isInteger(id) && id > 0 ? id : null;
}

function obterIdProduto(request) {
  const id = Number(request.params.id);

  return Number.isInteger(id) && id > 0 ? id : null;
}

function validarProduto(body, exigirEstoque = true) {
  const {
    nome,
    descricao,
    preco,
    estoque,
    ativo
  } = body || {};

  if (
    typeof nome !== "string" ||
    !nome.trim() ||
    preco === undefined ||
    (exigirEstoque && estoque === undefined)
  ) {
    return "Nome, preço e estoque são obrigatórios";
  }

  if (
    !Number.isFinite(Number(preco)) ||
    Number(preco) < 0
  ) {
    return "Preço inválido";
  }

  if (
    exigirEstoque &&
    (
      !Number.isInteger(Number(estoque)) ||
      Number(estoque) < 0
    )
  ) {
    return "Estoque deve ser um número inteiro não negativo";
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

class ProdutoController {

  static async listar(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      const produtos = await ProdutoModel.listar(usuarioId);

      return reply.send(produtos);

    } catch (error) {
      console.error("Erro ao listar produtos:", error);

      return reply.code(500).send({
        error: "Erro ao listar produtos"
      });
    }
  }

  static async buscarPorId(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);
      const id = obterIdProduto(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      if (!id) {
        return reply.code(400).send({
          error: "ID do produto inválido"
        });
      }

      const produto = await ProdutoModel.buscarPorId(
        id,
        usuarioId
      );

      if (!produto) {
        return reply.code(404).send({
          error: "Produto não encontrado"
        });
      }

      return reply.send(produto);

    } catch (error) {
      console.error("Erro ao buscar produto:", error);

      return reply.code(500).send({
        error: "Erro ao buscar produto"
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

      const erro = validarProduto(request.body);

      if (erro) {
        return reply.code(400).send({ error: erro });
      }

      const {
        nome,
        descricao,
        preco,
        estoque,
        ativo
      } = request.body;

      const produto = await ProdutoModel.criar({
        nome: nome.trim(),
        descricao,
        preco: Number(preco),
        estoque: Number(estoque),
        ativo: ativo ?? true,
        usuarioId
      });

      return reply.code(201).send(produto);

    } catch (error) {
      console.error("Erro ao criar produto:", error);

      return reply.code(500).send({
        error: "Erro ao criar produto"
      });
    }
  }

  static async atualizar(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);
      const id = obterIdProduto(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      if (!id) {
        return reply.code(400).send({
          error: "ID do produto inválido"
        });
      }

      const erro = validarProduto(request.body);

      if (erro) {
        return reply.code(400).send({ error: erro });
      }

      const {
        nome,
        descricao,
        preco,
        estoque,
        ativo
      } = request.body;

      const produto = await ProdutoModel.atualizar(id, {
        nome: nome.trim(),
        descricao,
        preco: Number(preco),
        estoque: Number(estoque),
        ativo: ativo ?? true,
        usuarioId
      });

      if (!produto) {
        return reply.code(404).send({
          error: "Produto não encontrado"
        });
      }

      return reply.send(produto);

    } catch (error) {
      console.error("Erro ao atualizar produto:", error);

      return reply.code(500).send({
        error: "Erro ao atualizar produto"
      });
    }
  }

  static async excluir(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);
      const id = obterIdProduto(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      if (!id) {
        return reply.code(400).send({
          error: "ID do produto inválido"
        });
      }

      const produto = await ProdutoModel.excluir(id, usuarioId);

      if (!produto) {
        return reply.code(404).send({
          error: "Produto não encontrado"
        });
      }

      return reply.send({
        message: "Produto excluído com sucesso",
        produto
      });

    } catch (error) {
      if (error.code === "23503") {
        return reply.code(409).send({
          error: "Este produto possui movimentações ou está vinculado a orçamentos e não pode ser excluído."
        });
      }

      console.error("Erro ao excluir produto:", error);

      return reply.code(500).send({
        error: "Erro ao excluir produto"
      });
    }
  }

  static async registrarEntradaEstoque(request, reply) {
    try {
      const usuarioId = obterUsuarioId(request);
      const id = obterIdProduto(request);
      const { quantidade } = request.body || {};

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      if (!id) {
        return reply.code(400).send({
          error: "ID do produto inválido"
        });
      }

      if (
        !Number.isInteger(Number(quantidade)) ||
        Number(quantidade) <= 0
      ) {
        return reply.code(400).send({
          error: "Quantidade deve ser um número inteiro maior que zero"
        });
      }

      const produto = await ProdutoModel.registrarEntradaEstoque(
        id,
        Number(quantidade),
        usuarioId
      );

      return reply.send({
        message: "Entrada de estoque registrada com sucesso",
        produto
      });

    } catch (error) {
      if (error.message === "Produto não encontrado") {
        return reply.code(404).send({
          error: error.message
        });
      }

      console.error("Erro ao registrar entrada:", error);

      return reply.code(500).send({
        error: "Erro ao registrar entrada de estoque"
      });
    }
  }
}

module.exports = ProdutoController;
