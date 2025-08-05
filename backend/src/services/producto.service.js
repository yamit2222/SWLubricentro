import { Producto } from "../entity/producto.entity.js";

export const productoService = {
  async crearProducto(data) {
    const nuevo = await Producto.create(data);
    return nuevo;
  },

  async obtenerProductos() {
    const productos = await Producto.findAll();
    return productos;
  },

  async obtenerProductoPorId(id) {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }
    return producto;
  },

  async modificarProducto(id, data) {
    if ('stock' in data) {
      delete data.stock;
    }
    const producto = await Producto.findByPk(id);
    if (!producto) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }
    await producto.update(data);
    return producto;
  },

  async eliminarProducto(id) {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }
    await producto.destroy();
    return true;
  },

  async actualizarStock(id, nuevoStock) {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }
    await producto.update({ stock: nuevoStock });
    return producto;
  }
};
