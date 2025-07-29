import { Producto } from "../entity/producto.entity.js";

export const productoService = {
  async crearProducto(data) {
    try {
      const nuevo = await Producto.create(data);
      return [nuevo, null];
    } catch (err) {
      return [null, err.message];
    }
  },

  async obtenerProductos() {
    try {
      const productos = await Producto.findAll();
      return [productos, null];
    } catch (err) {
      return [null, err.message];
    }
  },

  async obtenerProductoPorId(id) {
    try {
      const producto = await Producto.findByPk(id);
      if (!producto) return [null, "Producto no encontrado"];
      return [producto, null];
    } catch (err) {
      return [null, err.message];
    }
  },

  async modificarProducto(id, data) {
    try {
      // Evitar que el stock se modifique desde el endpoint
      if ('stock' in data) {
        delete data.stock;
      }
      const producto = await Producto.findByPk(id);
      if (!producto) return [null, "Producto no encontrado"];
      await producto.update(data);
      return [producto, null];
    } catch (err) {
      return [null, err.message];
    }
  },

  async eliminarProducto(id) {
    try {
      const producto = await Producto.findByPk(id);
      if (!producto) return [null, "Producto no encontrado"];
      await producto.destroy();
      return [true, null];
    } catch (err) {
      return [null, err.message];
    }
  }
};
