"use strict";

import { subproductoService } from "../services/subproducto.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess
} from "../handlers/responseHandlers.js";
import { subproductoValidation } from "../validations/subproducto.validation.js";

export const subproductoController = {
  async crearSubproducto(req, res) {    try {
      const data = req.body;

      const { error } = subproductoValidation().validate(data);
      if (error) return handleErrorClient(res, 400, error.details[0].message);

      const [subproducto, err] = await subproductoService.crearSubproducto(data);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 201, "Subproducto creado correctamente", subproducto);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerSubproductos(req, res) {
    try {
      const [subproductos, err] = await subproductoService.obtenerSubproductos();
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Subproductos obtenidos correctamente", subproductos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerSubproductoPorId(req, res) {
    try {
      const { id } = req.params;
      const [subproducto, err] = await subproductoService.obtenerSubproductoPorId(id);
      if (err) return handleErrorClient(res, 404, err);

      handleSuccess(res, 200, "Subproducto obtenido correctamente", subproducto);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async modificarSubproducto(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;      const { error } = subproductoValidation().validate(data);
      if (error) return handleErrorClient(res, 400, error.details[0].message);

      const [subproducto, err] = await subproductoService.modificarSubproducto(id, data);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 200, "Subproducto actualizado correctamente", subproducto);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarSubproducto(req, res) {
    try {
      const { id } = req.params;
      const [_, err] = await subproductoService.eliminarSubproducto(id);
      if (err) return handleErrorClient(res, 404, err);

      handleSuccess(res, 200, "Subproducto eliminado correctamente");
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
};
