import { Router } from 'express';
import { 
  registrarMovimiento, 
  listarMovimientos, 
  obtenerMovimientosPorProducto
} from '../controllers/movimientoStock.controller.js';
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();
router.use(authenticateJwt);

router.post('/', registrarMovimiento);
router.get('/', listarMovimientos);
router.get('/producto/:productoId', obtenerMovimientosPorProducto);

export default router;
