"use strict";
import User from "../entity/user.entity.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { Op } from "sequelize";

export async function getUserService(query) {
  try {
    const { rut, id, email } = query;

    const userFound = await User.findOne({
      where: {
        [Op.or]: [
          id ? { id: id } : null,
          rut ? { rut: rut } : null,
          email ? { email: email } : null,
        ].filter(Boolean)
      },
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { password, ...userData } = userFound.toJSON();

    return [userData, null];
  } catch (error) {
    console.error("Error obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUsersService() {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

    if (!users || users.length === 0) return [null, "No hay usuarios"];

    return [users, null];
  } catch (error) {
    console.error("Error al obtener a los usuarios:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateUserService(query, body) {
  try {
    const { id, rut, email } = query;

    const userFound = await User.findOne({
      where: {
        [Op.or]: [
          id ? { id: id } : null,
          rut ? { rut: rut } : null,
          email ? { email: email } : null,
        ].filter(Boolean)
      },
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { rut: body.rut },
          { email: body.email }
        ],
        id: { [Op.ne]: userFound.id }
      },
    });

    if (existingUser) {
      return [null, "Ya existe un usuario con el mismo rut o email"];
    }

    if (body.password) {
      const matchPassword = await comparePassword(
        body.password,
        userFound.password,
      );

      if (!matchPassword) return [null, "La contraseña no coincide"];
    }

    const dataUserUpdate = {
      nombreCompleto: body.nombreCompleto,
      rut: body.rut,
      email: body.email,
      rol: body.rol,
    };

    if (body.newPassword && body.newPassword.trim() !== "") {
      dataUserUpdate.password = await encryptPassword(body.newPassword);
    }

    await userFound.update(dataUserUpdate);

    const { password, ...userUpdated } = userFound.toJSON();

    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteUserService(query) {
  try {
    const { id, rut, email } = query;

    const userFound = await User.findOne({
      where: {
        [Op.or]: [
          id ? { id: id } : null,
          rut ? { rut: rut } : null,
          email ? { email: email } : null,
        ].filter(Boolean)
      },
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.rol === "administrador") {
      return [null, "No se puede eliminar un usuario con rol de administrador"];
    }

    const { password, ...dataUser } = userFound.toJSON();

    await userFound.destroy();

    return [dataUser, null];
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}