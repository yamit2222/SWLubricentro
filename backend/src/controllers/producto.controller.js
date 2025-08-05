"use strict";
import { productoService } from "../services/producto.service.js";
import {handleErrorClient,handleErrorServer,handleSuccess} from "../handlers/responseHandlers.js";
import { productoValidation } from "../validations/producto.validation.js";

export const productoController = {
  async crearProducto(req, res) {
    try {
      const data = req.body;

      const { error } = productoValidation().validate(data, { abortEarly: false });
      if (error) {
        // Mapear errores Joi a objeto { campo: mensaje }
        const errors = {};
        error.details.forEach((err) => {
          const field = err.path[0];
          if (!errors[field]) errors[field] = err.message;
        });
        return handleErrorClient(res, 400, "Error de validación", errors);
      }

      const [producto, err] = await productoService.crearProducto(data);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 201, "Producto creado correctamente", producto);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerProductos(req, res) {
    try {
      const [productos, err] = await productoService.obtenerProductos();
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Productos obtenidos correctamente", productos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerProductoPorId(req, res) {
    try {
      const { id } = req.params;
      const [producto, err] = await productoService.obtenerProductoPorId(id);
      if (err) return handleErrorClient(res, 404, err);

      handleSuccess(res, 200, "Producto obtenido correctamente", producto);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async modificarProducto(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const { error } = productoValidation().validate(data, { abortEarly: false });
      if (error) {
        const errors = {};
        error.details.forEach((err) => {
          const field = err.path[0];
          if (!errors[field]) errors[field] = err.message;
        });
        return handleErrorClient(res, 400, "Error de validación", errors);
      }

      const [producto, err] = await productoService.modificarProducto(id, data);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 200, "Producto actualizado correctamente", producto);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarProducto(req, res) {
    try {
      const { id } = req.params;
      const [_, err] = await productoService.eliminarProducto(id);
      if (err) return handleErrorClient(res, 404, err);

      handleSuccess(res, 200, "Producto eliminado correctamente");
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
};
