
const VeiculoController = require("../controllers/veiculo.controller");

async function veiculosRoutes(fastify) {

  fastify.get("/", {
    preHandler: [fastify.authenticate]
  }, VeiculoController.listar);

  fastify.get("/:id", {
    preHandler: [fastify.authenticate]
  }, VeiculoController.buscarPorId);

  fastify.post("/", {
    preHandler: [fastify.authenticate]
  }, VeiculoController.criar);

  fastify.put("/:id", {
    preHandler: [fastify.authenticate]
  }, VeiculoController.atualizar);

  fastify.delete("/:id", {
    preHandler: [fastify.authenticate]
  }, VeiculoController.excluir);
}

module.exports = veiculosRoutes;
