import { Router } from "express";
import { subproductoController } from "../controllers/subproducto.controller.js";

const router = Router();

router.post("/", subproductoController.crearSubproducto);
router.get("/", subproductoController.obtenerSubproductos);
router.get("/:id", subproductoController.obtenerSubproductoPorId);
router.put("/:id", subproductoController.modificarSubproducto);
router.delete("/:id", subproductoController.eliminarSubproducto);

export default router;
