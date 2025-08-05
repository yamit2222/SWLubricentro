import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDb.js";

export const Vehiculo = sequelize.define("Vehiculo", {
  Marca: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Modelo: {
    type: DataTypes.STRING,
    allowNull: false
  },  Año: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Filtro_de_aire: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Filtro_de_aceite: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Filtro_de_combustible: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Bateria: {
    type: DataTypes.STRING
  },
  Posicion:{
    type: DataTypes.STRING,
    allowNull: false
  }

});
