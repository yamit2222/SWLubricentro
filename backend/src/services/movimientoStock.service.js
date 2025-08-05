import { MovimientoStock } from "../entity/movimientoStock.entity.js";
import { Producto } from "../entity/producto.entity.js";
import { sequelize } from "../config/configDb.js";

export const movimientoStockService = {
  async registrarMovimiento(dataMovimiento) {
    const transaction = await sequelize.transaction();
    
    try {
      const { productoId, tipo, cantidad, observacion } = dataMovimiento;

      const producto = await Producto.findByPk(productoId, { transaction });
      if (!producto) {
        const error = new Error("Producto no encontrado");
        error.statusCode = 404;
        throw error;
      }

      let nuevoStock = producto.stock;
      if (tipo === 'entrada') {
        nuevoStock += cantidad;
      } else if (tipo === 'salida') {
        if (producto.stock < cantidad) {
          const error = new Error("Stock insuficiente para realizar la salida");
          error.statusCode = 400;
          throw error;
        }
        nuevoStock -= cantidad;
      } else {
        const error = new Error("Tipo de movimiento inválido. Debe ser 'entrada' o 'salida'");
        error.statusCode = 400;
        throw error;
      }

      const movimiento = await MovimientoStock.create({
        productoId,
        tipo,
        cantidad,
        observacion
      }, { transaction });

      await producto.update({ stock: nuevoStock }, { transaction });

      await transaction.commit();
      return movimiento;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async obtenerMovimientos() {
    const movimientos = await MovimientoStock.findAll({
      include: [{ 
        model: Producto,
        attributes: ['id', 'nombre', 'codigoP', 'categoria']
      }],
      order: [['createdAt', 'DESC']]
    });

    return movimientos;
  },

  async obtenerMovimientosPorProducto(productoId) {
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const movimientos = await MovimientoStock.findAll({
      where: { productoId },
      include: [{ 
        model: Producto,
        attributes: ['id', 'nombre', 'codigoP']
      }],
      order: [['createdAt', 'DESC']]
    });    return movimientos;
  }
};
