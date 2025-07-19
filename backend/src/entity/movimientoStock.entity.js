import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDb.js";
import { Producto } from "./producto.entity.js";

export const MovimientoStock = sequelize.define("MovimientoStock", {
  tipo: {
    type: DataTypes.ENUM('entrada', 'salida'),
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  observacion: {
    type: DataTypes.STRING
  }
});

Producto.hasMany(MovimientoStock, { foreignKey: 'productoId' });
MovimientoStock.belongsTo(Producto, { foreignKey: 'productoId' });
