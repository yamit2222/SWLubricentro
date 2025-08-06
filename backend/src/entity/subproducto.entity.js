import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDb.js";

export const SubProducto = sequelize.define("SubProducto", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },   
  codigosubP: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },  precio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoria: {
    type: DataTypes.ENUM("repuestos", "limpieza", "accesorios externos", "accesorios eléctricos"),
    allowNull: false
  }
});
