import { Pedido } from "../entity/pedido.entity.js";
import { Producto } from "../entity/producto.entity.js";
import { Op } from "sequelize";
import { sequelize } from "../config/configDb.js";

export const pedidoService = {
  async obtenerPedidos() {
    const pedidos = await Pedido.findAll({
      include: [{
        model: Producto,
        attributes: ['id', 'nombre', 'precio', 'stock']
      }],
      order: [["createdAt", "DESC"]]
    });
    
    return pedidos;
  },

  async crearPedido(dataPedido) {
    const transaction = await sequelize.transaction();
    
    try {
      const { comentario, productoId, cantidad, estado } = dataPedido;
      
      if (!comentario || !productoId || !cantidad) {
        const error = new Error("Todos los campos son obligatorios");
        error.statusCode = 400;
        throw error;
      }

      const prod = await Producto.findByPk(productoId, { transaction });
      if (!prod) {
        const error = new Error("Producto no encontrado");
        error.statusCode = 404;
        throw error;
      }

      if (prod.stock < cantidad) {
        const error = new Error("Stock insuficiente");
        error.statusCode = 400;
        throw error;
      }

      await prod.update({ stock: prod.stock - cantidad }, { transaction });

      const hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const pedido = await Pedido.create({ 
        comentario, 
        productoId, 
        cantidad, 
        hora, 
        estado: estado || 'en proceso' 
      }, { transaction });

      await transaction.commit();
      return pedido;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async obtenerPedidoPorId(id) {
    const pedido = await Pedido.findByPk(id, {
      include: [{
        model: Producto,
        attributes: ['id', 'nombre', 'precio', 'stock']
      }]
    });
    
    if (!pedido) {
      const error = new Error("Pedido no encontrado");
      error.statusCode = 404;
      throw error;
    }
    
    return pedido;
  },
  async actualizarPedido(id, { estado }) {
    const transaction = await sequelize.transaction();
    
    try {
      const pedido = await Pedido.findByPk(id, { transaction });
      if (!pedido) {
        const error = new Error("Pedido no encontrado");
        error.statusCode = 404;
        throw error;
      }

      await pedido.update({ estado }, { transaction });

      await transaction.commit();
      return pedido;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async eliminarPedido(id) {
    const transaction = await sequelize.transaction();
    
    try {
      const pedido = await Pedido.findByPk(id, { transaction });
      if (!pedido) {
        const error = new Error("Pedido no encontrado");
        error.statusCode = 404;
        throw error;
      }

      const prod = await Producto.findByPk(pedido.productoId, { transaction });
      if (prod) {
        await prod.update({ stock: prod.stock + pedido.cantidad }, { transaction });
      }

      await pedido.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
