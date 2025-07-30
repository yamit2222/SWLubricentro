import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDb.js";

export const Pedido = sequelize.define("Pedido", {
  comentario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  producto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hora: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('en proceso', 'vendido'),
    allowNull: false,
    defaultValue: 'en proceso'
  }
}, {
  timestamps: true
});
