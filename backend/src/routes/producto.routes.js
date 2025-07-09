import { Router } from "express";
import { productoController } from "../controllers/producto.controller.js";

const router = Router();

router.post("/", productoController.crearProducto);
router.get("/", productoController.obtenerProductos);
router.get("/:id", productoController.obtenerProductoPorId);
router.put("/:id", productoController.modificarProducto);
router.delete("/:id", productoController.eliminarProducto);

export default router;
