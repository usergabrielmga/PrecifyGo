const ServicoController = require("../controllers/servicos.controller");

async function servicosRoutes(fastify) {

  fastify.get("/", {
    preHandler: [fastify.authenticate]
  }, ServicoController.listar);

  fastify.get("/:id", {
    preHandler: [fastify.authenticate]
  }, ServicoController.buscarPorId);

  fastify.post("/", {
    preHandler: [fastify.authenticate]
  }, ServicoController.criar);

  fastify.put("/:id", {
    preHandler: [fastify.authenticate]
  }, ServicoController.atualizar);

  fastify.delete("/:id", {
    preHandler: [fastify.authenticate]
  }, ServicoController.excluir);

}

module.exports = servicosRoutes;