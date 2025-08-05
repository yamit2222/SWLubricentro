import { movimientoStockService } from '../services/movimientoStock.service.js';
import { movimientoStockValidation } from '../validations/movimientoStock.validation.js';

export const registrarMovimiento = async (req, res) => {
  try {
    const { error } = movimientoStockValidation.registrarMovimiento().validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: "Datos inválidos", 
        detalles: error.details.map(d => d.message) 
      });
    }
    const movimiento = await movimientoStockService.registrarMovimiento(req.body);
    res.status(201).json({
      message: "Movimiento de stock registrado exitosamente",
      data: movimiento
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    if (statusCode >= 400 && statusCode < 500) {
      return res.status(statusCode).json({ error: error.message });
    }
    res.status(500).json({ 
      error: "Error interno del servidor",
      detalles: error.message 
    });
  }
};

export const listarMovimientos = async (req, res) => {
  try {
    const movimientos = await movimientoStockService.obtenerMovimientos();
    
    res.json({
      message: "Movimientos obtenidos exitosamente",
      data: movimientos
    });

  } catch (error) {
    res.status(500).json({ 
      error: "Error interno del servidor",
      detalles: error.message 
    });
  }
};

export const obtenerMovimientosPorProducto = async (req, res) => {
  try {
    const { error } = movimientoStockValidation.obtenerMovimientosPorProducto().validate({
      productoId: parseInt(req.params.productoId)
    });
    
    if (error) {
      return res.status(400).json({ 
        error: "ID de producto inválido", 
        detalles: error.details.map(d => d.message) 
      });
    }

    const movimientos = await movimientoStockService.obtenerMovimientosPorProducto(
      parseInt(req.params.productoId)
    );
    
    res.json({
      message: "Movimientos del producto obtenidos exitosamente",
      data: movimientos
    });

  } catch (error) {
    const statusCode = error.statusCode || 500;
    if (statusCode === 404) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ 
      error: "Error interno del servidor",
      detalles: error.message 
    });  }
};

