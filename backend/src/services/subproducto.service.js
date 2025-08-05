import { SubProducto } from "../entity/subproducto.entity.js";

export const subproductoService = {
  async crearSubproducto(data) {
    const nuevo = await SubProducto.create(data);
    return nuevo;
  },

  async obtenerSubproductos() {
    const subproductos = await SubProducto.findAll();
    return subproductos;
  },

  async obtenerSubproductoPorId(id) {
    const subproducto = await SubProducto.findByPk(id);
    if (!subproducto) {
      const error = new Error("Subproducto no encontrado");
      error.statusCode = 404;
      throw error;
    }
    return subproducto;
  },

  async modificarSubproducto(id, data) {
    if ('stock' in data) {
      delete data.stock;
    }
    const subproducto = await SubProducto.findByPk(id);
    if (!subproducto) {
      const error = new Error("Subproducto no encontrado");
      error.statusCode = 404;
      throw error;
    }
    await subproducto.update(data);
    return subproducto;
  },

  async eliminarSubproducto(id) {
    const subproducto = await SubProducto.findByPk(id);
    if (!subproducto) {
      const error = new Error("Subproducto no encontrado");
      error.statusCode = 404;
      throw error;
    }
    await subproducto.destroy();
    return true;
  }
};
