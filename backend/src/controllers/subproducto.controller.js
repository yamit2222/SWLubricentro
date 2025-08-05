"use strict";

import { subproductoService } from "../services/subproducto.service.js";
import {handleErrorClient,handleErrorServer,handleSuccess} from "../handlers/responseHandlers.js";
import { subproductoValidation } from "../validations/subproducto.validation.js";

export const subproductoController = {
  async crearSubproducto(req, res) {
    try {
      const data = req.body;

      const { error } = subproductoValidation().validate(data, { abortEarly: false });
      if (error) {
        const errors = {};
        error.details.forEach((err) => {
          const field = err.path[0];
          if (!errors[field]) errors[field] = err.message;
        });
        return handleErrorClient(res, 400, "Error de validación", errors);
      }

      const subproducto = await subproductoService.crearSubproducto(data);
      handleSuccess(res, 201, "Subproducto creado correctamente", subproducto);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerSubproductos(req, res) {
    try {
      const subproductos = await subproductoService.obtenerSubproductos();
      handleSuccess(res, 200, "Subproductos obtenidos correctamente", subproductos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerSubproductoPorId(req, res) {
    try {
      const { id } = req.params;
      const subproducto = await subproductoService.obtenerSubproductoPorId(id);
      handleSuccess(res, 200, "Subproducto obtenido correctamente", subproducto);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      if (statusCode === 404) {
        return handleErrorClient(res, 404, error.message);
      }
      handleErrorServer(res, 500, error.message);
    }
  },

  async modificarSubproducto(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const { error } = subproductoValidation().validate(data, { abortEarly: false });
      if (error) {
        const errors = {};
        error.details.forEach((err) => {
          const field = err.path[0];
          if (!errors[field]) errors[field] = err.message;
        });
        return handleErrorClient(res, 400, "Error de validación", errors);
      }

      const subproducto = await subproductoService.modificarSubproducto(id, data);
      handleSuccess(res, 200, "Subproducto actualizado correctamente", subproducto);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      if (statusCode === 404) {
        return handleErrorClient(res, 404, error.message);
      }
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarSubproducto(req, res) {
    try {
      const { id } = req.params;
      await subproductoService.eliminarSubproducto(id);
      handleSuccess(res, 200, "Subproducto eliminado correctamente");
    } catch (error) {
      const statusCode = error.statusCode || 500;
      if (statusCode === 404) {
        return handleErrorClient(res, 404, error.message);
      }
      handleErrorServer(res, 500, error.message);
    }
  }
};
