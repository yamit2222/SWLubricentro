"use strict";
import User from "../entity/user.entity.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const count = await User.count();
    if (count > 0) return;

    await Promise.all([
      User.create({
        nombreCompleto: "Yamit Soto Gallardo",
        rut: "20.960.456-6",
        email: "theboss@gmail.cl",
        password: await encryptPassword("boss1234"),
        rol: "administrador",
      }),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };