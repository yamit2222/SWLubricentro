import { Router } from "express";
import { vehiculoController } from "../controllers/vehiculo.controller.js";

const router = Router();

router.post("/", vehiculoController.crearVehiculo);
router.get("/", vehiculoController.obtenerVehiculos);
router.get("/:id", vehiculoController.obtenerVehiculoPorId);
router.put("/:id", vehiculoController.modificarVehiculo);
router.delete("/:id", vehiculoController.eliminarVehiculo);

export default router;
