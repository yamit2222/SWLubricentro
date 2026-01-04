import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDb.js";
import { Producto } from "./producto.entity.js";
import { SubProducto } from "./subproducto.entity.js";
import User from "./user.entity.js";

export const Pedido = sequelize.define("Pedido", {
  comentario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Productos',
      key: 'id'
    },
    comment: 'ID del producto (null si es subproducto)'
  },
  subproductoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'SubProductos', 
      key: 'id'
    },
    comment: 'ID del subproducto (null si es producto)'
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('en proceso', 'vendido'),
    allowNull: false,
    defaultValue: 'en proceso'
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID del usuario que realizó el pedido'
  }
}, {
  timestamps: true,
  validate: {
    // Validar que solo uno de los campos esté presente
    soloUnItem() {
      const tieneProducto = this.productoId !== null;
      const tieneSubproducto = this.subproductoId !== null;
      
      if (!tieneProducto && !tieneSubproducto) {
        throw new Error('Debe especificar un producto o subproducto');
      }
      
      if (tieneProducto && tieneSubproducto) {
        throw new Error('No puede especificar tanto producto como subproducto');
      }
    }
  }
});

// Relaciones con integridad referencial
Producto.hasMany(Pedido, { 
  foreignKey: 'productoId',
  as: 'PedidosProducto',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

SubProducto.hasMany(Pedido, { 
  foreignKey: 'subproductoId',
  as: 'PedidosSubProducto', 
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Pedido.belongsTo(Producto, { 
  foreignKey: 'productoId',
  as: 'Producto'
});

Pedido.belongsTo(SubProducto, { 
  foreignKey: 'subproductoId',
  as: 'SubProducto'
});

// Relación con Usuario
Pedido.belongsTo(User, {
  foreignKey: 'usuarioId',
  as: 'Usuario'
});
