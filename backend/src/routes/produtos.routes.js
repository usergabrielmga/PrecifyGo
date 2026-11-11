const ProdutoController = require("../controllers/produtos.controller");

async function produtosRoutes(fastify) {

  fastify.get("/", {
    preHandler: [fastify.authenticate]
  }, ProdutoController.listar);

  fastify.get("/:id", {
    preHandler: [fastify.authenticate]
  }, ProdutoController.buscarPorId);

  fastify.post("/", {
    preHandler: [fastify.authenticate]
  }, ProdutoController.criar);

  fastify.post("/:id/entrada", {
    preHandler: [fastify.authenticate]
  }, ProdutoController.registrarEntradaEstoque);

  fastify.put("/:id", {
    preHandler: [fastify.authenticate]
  }, ProdutoController.atualizar);

  fastify.delete("/:id", {
    preHandler: [fastify.authenticate]
  }, ProdutoController.excluir);

}

module.exports = produtosRoutes;