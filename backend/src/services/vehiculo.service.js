import { Vehiculo } from "../entity/vehiculo.entity.js";

export const vehiculoService = {
  async crearVehiculo(data) {
    try {
      const nuevo = await Vehiculo.create(data);
      return [nuevo, null];
    } catch (err) {
      return [null, err.message];
    }
  },

  async obtenerVehiculos() {
    try {
      const vehiculos = await Vehiculo.findAll();
      return [vehiculos, null];
    } catch (err) {
      return [null, err.message];
    }
  },

  async obtenerVehiculoPorId(id) {
    try {
      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) return [null, "Vehículo no encontrado"];
      return [vehiculo, null];
    } catch (err) {
      return [null, err.message];
    }
  },

  async modificarVehiculo(id, data) {
    try {
      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) return [null, "Vehículo no encontrado"];
      await vehiculo.update(data);
      return [vehiculo, null];
    } catch (err) {
      return [null, err.message];
    }
  },

  async eliminarVehiculo(id) {
    try {
      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) return [null, "Vehículo no encontrado"];
      await vehiculo.destroy();
      return [true, null];
    } catch (err) {
      return [null, err.message];
    }
  },
};


