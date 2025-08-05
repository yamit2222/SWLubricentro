import { Router } from "express";
import { pedidoController } from "../controllers/pedido.controller.js";
import { Pedido } from "../entity/pedido.entity.js";

const router = Router();

router.get("/", pedidoController.obtenerPedidos);
router.post("/", pedidoController.crearPedido);
router.get("/:id", pedidoController.obtenerPedidoPorId);
router.put("/:id", pedidoController.actualizarPedido);
router.delete("/:id", pedidoController.eliminarPedido);

export default router;
