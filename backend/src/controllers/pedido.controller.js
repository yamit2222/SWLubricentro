import { pedidoService } from "../services/pedido.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { Pedido } from "../entity/pedido.entity.js";

export const pedidoController = {
  async obtenerPedidosDelDia(req, res) {
    try {
      const [pedidos, err] = await pedidoService.obtenerPedidosDelDia();
      if (err) return handleErrorClient(res, 500, err);
      handleSuccess(res, 200, "Pedidos del día obtenidos", pedidos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async crearPedido(req, res) {
    try {
      const { comentario, producto, cantidad, estado } = req.body;
      if (!comentario || !producto || !cantidad) {
        return handleErrorClient(res, 400, "Todos los campos son obligatorios");
      }
       
      const prod = await import('../entity/producto.entity.js').then(m => m.Producto.findByPk(producto));
      if (!prod) {
        return handleErrorClient(res, 404, "Producto no encontrado");
      }
      if (prod.stock < cantidad) {
        return handleErrorClient(res, 400, "Stock insuficiente");
      }
      await prod.update({ stock: prod.stock - cantidad });
      const hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const pedido = await Pedido.create({ comentario, producto, cantidad, hora, estado: estado || 'en proceso' });
      handleSuccess(res, 201, "Pedido creado", pedido);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerPedidoPorId(req, res) {
    try {
      const { id } = req.params;
      const pedido = await Pedido.findByPk(id);
      if (!pedido) return handleErrorClient(res, 404, "Pedido no encontrado");
      handleSuccess(res, 200, "Pedido obtenido", pedido);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async actualizarPedido(req, res) {
    try {
      const { id } = req.params;
      const { comentario, producto, cantidad, estado } = req.body;
      const pedido = await Pedido.findByPk(id);
      if (!pedido) return handleErrorClient(res, 404, "Pedido no encontrado");
      // Si se cambia producto o cantidad, ajustar stock
      let prodAntiguo = null;
      let prodNuevo = null;
      if ((producto && producto !== pedido.producto) || (cantidad && cantidad !== pedido.cantidad)) {
        prodAntiguo = await import('../entity/producto.entity.js').then(m => m.Producto.findByPk(pedido.producto));
        prodNuevo = await import('../entity/producto.entity.js').then(m => m.Producto.findByPk(producto || pedido.producto));
        if (!prodNuevo) return handleErrorClient(res, 404, "Producto nuevo no encontrado");
        if (producto && producto !== pedido.producto) {
          await prodAntiguo.update({ stock: prodAntiguo.stock + pedido.cantidad });
          if (prodNuevo.stock < (cantidad || pedido.cantidad)) {
            return handleErrorClient(res, 400, "Stock insuficiente en producto nuevo");
          }
          await prodNuevo.update({ stock: prodNuevo.stock - (cantidad || pedido.cantidad) });
        } else if (cantidad && cantidad !== pedido.cantidad) {
          const diferencia = cantidad - pedido.cantidad;
          if (diferencia > 0) {
            if (prodNuevo.stock < diferencia) {
              return handleErrorClient(res, 400, "Stock insuficiente para aumentar cantidad");
            }
            await prodNuevo.update({ stock: prodNuevo.stock - diferencia });
          } else if (diferencia < 0) {
            await prodNuevo.update({ stock: prodNuevo.stock + Math.abs(diferencia) });
          }
        }
      }
      
      await pedido.update({
        comentario: comentario ?? pedido.comentario,
        producto: producto ?? pedido.producto,
        cantidad: cantidad ?? pedido.cantidad,
        estado: estado ?? pedido.estado
      });
      handleSuccess(res, 200, "Pedido actualizado", pedido);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarPedido(req, res) {
    try {
      const { id } = req.params;
      const pedido = await Pedido.findByPk(id);
      if (!pedido) return handleErrorClient(res, 404, "Pedido no encontrado");
      // Devolver stock al producto al eliminar pedido
      const prod = await import('../entity/producto.entity.js').then(m => m.Producto.findByPk(pedido.producto));
      if (prod) {
        await prod.update({ stock: prod.stock + pedido.cantidad });
      }
      await pedido.destroy();
      handleSuccess(res, 200, "Pedido eliminado", null);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
};
