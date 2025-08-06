import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDb.js";
import { Producto } from "./producto.entity.js";

export const Pedido = sequelize.define("Pedido", {
  comentario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Productos',
      key: 'id'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hora: {
    type: DataTypes.STRING,
    allowNull: false
  },  estado: {
    type: DataTypes.ENUM('en proceso', 'vendido'),
    allowNull: false,
    defaultValue: 'en proceso'
  }
}, {
  timestamps: true
});

Producto.hasMany(Pedido, { foreignKey: 'productoId' });
Pedido.belongsTo(Producto, { foreignKey: 'productoId' });
