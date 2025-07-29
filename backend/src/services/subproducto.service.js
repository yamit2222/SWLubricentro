import { SubProducto } from "../entity/subproducto.entity.js";

export const subproductoService = {
  async crearSubproducto(data) {
    try {
      const nuevo = await SubProducto.create(data);
      return [nuevo, null];
    } catch (err) {
      return [null, err.message];
    }
  },
  async obtenerSubproductos() {
    try {
      const subproductos = await SubProducto.findAll();
      return [subproductos, null];
    } catch (err) {
      return [null, err.message];
    }
  },
  async obtenerSubproductoPorId(id) {
    try {
      const subproducto = await SubProducto.findByPk(id);
      if (!subproducto) return [null, "Subproducto no encontrado"];
      return [subproducto, null];
    } catch (err) {
      return [null, err.message];
    }
  },
  async modificarSubproducto(id, data) {
    try {
      if ('stock' in data) {
        delete data.stock;
      }
      const subproducto = await SubProducto.findByPk(id);
      if (!subproducto) return [null, "Subproducto no encontrado"];
      await subproducto.update(data);
      return [subproducto, null];
    } catch (err) {
      return [null, err.message];
    }
  },
  async eliminarSubproducto(id) {
    try {
      const subproducto = await SubProducto.findByPk(id);
      if (!subproducto) return [null, "Subproducto no encontrado"];
      await subproducto.destroy();
      return [true, null];
    } catch (err) {
      return [null, err.message];
    }
  }
};
