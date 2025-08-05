import { Router } from 'express';
import { 
  registrarMovimiento, 
  listarMovimientos, 
  obtenerMovimientosPorProducto
} from '../controllers/movimientoStock.controller.js';

const router = Router();

router.post('/', registrarMovimiento);
router.get('/', listarMovimientos);
router.get('/producto/:productoId', obtenerMovimientosPorProducto);

export default router;
