import { Router } from "express";
import { productoController } from "../controllers/producto.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();
router.use(authenticateJwt);

router.post("/", productoController.crearProducto);
router.get("/", productoController.obtenerProductos);
router.get("/:id", productoController.obtenerProductoPorId);
router.put("/:id", productoController.modificarProducto);
router.delete("/:id", productoController.eliminarProducto);

export default router;
