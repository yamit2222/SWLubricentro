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
        const errors = {};
        error.details.forEach((err) => {
          const field = err.path[0];
          if (!errors[field]) errors[field] = err.message;
        });
        return handleErrorClient(res, 400, "Error de validación", errors);
      }

      const producto = await productoService.crearProducto(data);
      handleSuccess(res, 201, "Producto creado correctamente", producto);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },
  async obtenerProductos(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const productos = await productoService.obtenerProductos({ 
        page: parseInt(page), 
        limit: parseInt(limit) 
      });
      handleSuccess(res, 200, "Productos obtenidos correctamente", productos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerProductoPorId(req, res) {
    try {
      const { id } = req.params;
      const producto = await productoService.obtenerProductoPorId(id);
      handleSuccess(res, 200, "Producto obtenido correctamente", producto);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      if (statusCode === 404) {
        return handleErrorClient(res, 404, error.message);
      }
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

      const producto = await productoService.modificarProducto(id, data);
      handleSuccess(res, 200, "Producto actualizado correctamente", producto);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      if (statusCode === 404) {
        return handleErrorClient(res, 404, error.message);
      }
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarProducto(req, res) {
    try {
      const { id } = req.params;
      await productoService.eliminarProducto(id);
      handleSuccess(res, 200, "Producto eliminado correctamente");
    } catch (error) {
      const statusCode = error.statusCode || 500;
      if (statusCode === 404) {
        return handleErrorClient(res, 404, error.message);
      }
      handleErrorServer(res, 500, error.message);
    }
  }
};
