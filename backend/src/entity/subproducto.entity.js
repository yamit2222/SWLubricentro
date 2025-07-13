import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDb.js";

export const SubProducto = sequelize.define("SubProducto", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codigosubP: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  marca: {
    type: DataTypes.STRING
  },
  tipo: {
    type: DataTypes.STRING
  }
});
