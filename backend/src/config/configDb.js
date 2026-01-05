"use strict";
import { Sequelize } from "sequelize";
import { 
  DB_HOST, 
  DB_PORT,
  DB_USERNAME, 
  PASSWORD, 
  DATABASE,
  NODE_ENV
} from "./configEnv.js";


export const sequelize = new Sequelize(
  DATABASE,
  DB_USERNAME,
  PASSWORD,
  {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: NODE_ENV === 'development' ? false : false,
    define: {
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    retry: {
      max: 10,
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /SequelizeConnectionAcquireTimeoutError/
      ]
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  }
);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Conexión exitosa a la base de datos!");


    await sequelize.sync();
    console.log("Modelos sincronizados con la base de datos");

    return sequelize;
  } catch (error) {
    console.error("Error al conectar con la base de datos");
    if (NODE_ENV === 'development') {
      console.error("Detalles del error:", error.message);
    }
    process.exit(1);
  }}
