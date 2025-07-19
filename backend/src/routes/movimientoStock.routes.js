import { Router } from 'express';
import { registrarMovimiento, listarMovimientos } from '../controllers/movimientoStock.controller.js';

const router = Router();

router.post('/', registrarMovimiento);
router.get('/', listarMovimientos);

export default router;
