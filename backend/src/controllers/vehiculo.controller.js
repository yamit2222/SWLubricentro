"use strict";

import { vehiculoService } from "../services/vehiculo.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess
} from "../handlers/responseHandlers.js";
import { vehiculoValidation } from "../validations/vehiculo.validation.js";

export const vehiculoController = {
  async crearVehiculo(req, res) {
    try {
      const data = req.body;

      const { error } = vehiculoValidation().validate(data);
      if (error) return handleErrorClient(res, 400, error.details[0].message);

      const [vehiculo, err] = await vehiculoService.crearVehiculo(data);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 201, "vehiculo habitual creado correctamente", vehiculo);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },
  async obtenerVehiculos(req, res) {
    try {
      const [vehiculos, err] = await vehiculoService.obtenerVehiculos();
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Vehículos obtenidos correctamente", vehiculos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerVehiculoPorId(req, res) {
    try {
      const { id } = req.params;
      const [vehiculo, err] = await vehiculoService.obtenerVehiculoPorId(id);
      if (err) return handleErrorClient(res, 404, err);

      handleSuccess(res, 200, "vehiculo habitual obtenido correctamente", vehiculo);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async modificarVehiculo(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const { error } = vehiculoValidation().validate(data);
      if (error) return handleErrorClient(res, 400, error.details[0].message);

      const [vehiculo, err] = await vehiculoService.modificarVehiculo(id, data);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 200, "Vehículo actualizado correctamente", vehiculo);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarVehiculo(req, res) {
    try {
      const { id } = req.params;
      const [_, err] = await vehiculoService.eliminarVehiculo(id);
      if (err) return handleErrorClient(res, 404, err);

      handleSuccess(res, 200, "vehiculo habitual eliminado correctamente");
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
};
