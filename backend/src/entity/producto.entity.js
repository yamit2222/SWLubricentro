import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDb.js";

export const Producto = sequelize.define("Producto", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },  
  codigoP: {
    type: DataTypes.INTEGER,
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
  categoria: {
    type: DataTypes.ENUM('aceite', 'filtro', 'bateria'),
    allowNull: false
  },
  subcategoria: {
    type: DataTypes.ENUM("auto", "camioneta", "vehiculo comercial", "motocicleta", "maquinaria"),
    allowNull: false
  }
});
