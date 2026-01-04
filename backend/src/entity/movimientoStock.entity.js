import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDb.js";
import { Producto } from "./producto.entity.js";
import { SubProducto } from "./subproducto.entity.js";
import User from "./user.entity.js";

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
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID del producto o subproducto'
  },
  itemType: {
    type: DataTypes.ENUM('producto', 'subproducto'),
    allowNull: false,
    comment: 'Tipo de item: producto o subproducto'
  },
  // Mantener productoId para compatibilidad con registros existentes
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID del usuario que realizó el movimiento'
  },
  fecha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hora: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

// Relaciones polimórficas
MovimientoStock.belongsTo(Producto, {
  foreignKey: 'itemId',
  constraints: false,
  as: 'ProductoItem'
});

MovimientoStock.belongsTo(SubProducto, {
  foreignKey: 'itemId',
  constraints: false,
  as: 'SubProductoItem'
});

// Relación antigua para compatibilidad
MovimientoStock.belongsTo(Producto, { 
  foreignKey: 'productoId',
  as: 'Producto'
});

// Relación con Usuario
MovimientoStock.belongsTo(User, {
  foreignKey: 'usuarioId',
  as: 'Usuario'
});

// Relaciones inversas
Producto.hasMany(MovimientoStock, {
  foreignKey: 'itemId',
  constraints: false
});

SubProducto.hasMany(MovimientoStock, {
  foreignKey: 'itemId',
  constraints: false
});

// Relación antigua
Producto.hasMany(MovimientoStock, { foreignKey: 'productoId' });
