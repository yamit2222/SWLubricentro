import { pedidoService } from "../services/pedido.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { pedidoValidation } from "../validations/pedido.validation.js";

export const pedidoController = {
  async obtenerPedidos(req, res) {
    try {
      const pedidos = await pedidoService.obtenerPedidos();
      handleSuccess(res, 200, "Pedidos obtenidos", pedidos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async crearPedido(req, res) {
    try {
      const { error, value } = pedidoValidation.crearPedido.validate(req.body);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const pedido = await pedidoService.crearPedido(value);
      handleSuccess(res, 201, "Pedido creado", pedido);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      if (statusCode >= 400 && statusCode < 500) {
        return handleErrorClient(res, statusCode, error.message);
      }
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerPedidoPorId(req, res) {
    try {
      const { id } = req.params;
      const pedido = await pedidoService.obtenerPedidoPorId(id);
      handleSuccess(res, 200, "Pedido obtenido", pedido);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      if (statusCode === 404) {
        return handleErrorClient(res, 404, error.message);
      }
      handleErrorServer(res, 500, error.message);
    }
  },

  async actualizarPedido(req, res) {
    try {
      const { error, value } = pedidoValidation.actualizarPedido.validate(req.body);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }      const { id } = req.params;
      const pedido = await pedidoService.actualizarPedido(id, value);
      handleSuccess(res, 200, "Estado del pedido actualizado", pedido);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      if (statusCode >= 400 && statusCode < 500) {
        return handleErrorClient(res, statusCode, error.message);
      }
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarPedido(req, res) {
    try {
      const { id } = req.params;
      await pedidoService.eliminarPedido(id);
      handleSuccess(res, 200, "Pedido eliminado", null);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      if (statusCode === 404) {
        return handleErrorClient(res, 404, error.message);
      }
      handleErrorServer(res, 500, error.message);
    }
  }
};
