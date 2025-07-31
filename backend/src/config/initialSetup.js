"use strict";
import User from "../entity/user.entity.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import { Producto } from '../entity/producto.entity.js';
import { SubProducto } from '../entity/subproducto.entity.js';
import { Vehiculo } from '../entity/vehiculo.entity.js';
import productosEjemplo from '../entity/ejemplo.productos.js';
import subproductosEjemplo from '../entity/ejemplo.subproductos.js';
import vehiculosEjemplo from '../entity/ejemplo.vehiculos.js';

async function createUsers() {
  try {
    const count = await User.count();
    if (count > 0) return;

    await Promise.all([
      User.create({
        nombreCompleto: "Yamit Soto Gallardo",
        rut: "20.960.456-6",
        email: "theboss@gmail.cl",
        password: await encryptPassword("boss1234"),
        rol: "administrador",
      }),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

async function createProductos() {
  try {
    const count = await Producto.count();
    if (count > 0) return;
    await Producto.bulkCreate(productosEjemplo);
    console.log('* => Productos creados exitosamente');
  } catch (error) {
    console.error('Error al crear productos:', error);
  }
}

async function createSubProductos() {
  try {
    const count = await SubProducto.count();
    if (count > 0) return;
    await SubProducto.bulkCreate(subproductosEjemplo);
    console.log('* => Subproductos creados exitosamente');
  } catch (error) {
    console.error('Error al crear subproductos:', error);
  }
}

async function createVehiculos() {
  try {
    const count = await Vehiculo.count();
    if (count > 0) return;
    await Vehiculo.bulkCreate(vehiculosEjemplo);
    console.log('* => Vehículos creados exitosamente');
  } catch (error) {
    console.error('Error al crear vehículos:', error);
  }
}

export { createUsers, createProductos, createSubProductos, createVehiculos };