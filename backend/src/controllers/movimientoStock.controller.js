import { MovimientoStock } from '../entity/movimientoStock.entity.js';
import { Producto } from '../entity/producto.entity.js';

export const registrarMovimiento = async (req, res) => {
  try {
    const { productoId, tipo, cantidad, observacion } = req.body;
    const producto = await Producto.findByPk(productoId);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    
    let nuevoStock = producto.stock;
    if (tipo === 'entrada') {
      nuevoStock += cantidad;
    } else if (tipo === 'salida') {
      if (producto.stock < cantidad) {
        return res.status(400).json({ error: 'Stock insuficiente' });
      }
      nuevoStock -= cantidad;
    } else {
      return res.status(400).json({ error: 'Tipo de movimiento inválido' });
    }
    const movimiento = await MovimientoStock.create({
      productoId,
      tipo,
      cantidad,
      observacion
    });
   
    await producto.update({ stock: nuevoStock });

    res.status(201).json(movimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarMovimientos = async (req, res) => {
  try {
    const movimientos = await MovimientoStock.findAll({
      include: [{ model: Producto }],
      order: [['createdAt', 'DESC']]
    });
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
