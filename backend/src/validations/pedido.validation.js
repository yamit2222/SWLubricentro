import Joi from "joi";

export const pedidoValidation = {
  crearPedido: Joi.object({
    comentario: Joi.string().min(1).max(255).required().messages({
        "string.empty": "El comentario es obligatorio",
        "string.min": "El comentario debe tener al menos 1 carácter",
        "string.max": "El comentario no puede exceder 255 caracteres",
        "any.required": "El comentario es obligatorio"
      }),
    productoId: Joi.number().integer().positive().required().messages({
        "number.base": "El producto debe ser un número",
        "number.integer": "El producto debe ser un número entero",
        "number.positive": "El producto debe ser un número positivo",
        "any.required": "El producto es obligatorio"
      }),
    cantidad: Joi.number().integer().min(1).required().messages({
        "number.base": "La cantidad debe ser un número",
        "number.integer": "La cantidad debe ser un número entero",
        "number.min": "La cantidad debe ser mayor a 0",
        "any.required": "La cantidad es obligatoria"
      }),  
    estado: Joi.string().valid("en proceso", "vendido").default("en proceso").messages({
        "any.only": "El estado debe ser: en proceso o vendido"
      })  }),

  actualizarPedido: Joi.object({
    estado: Joi.string().valid("en proceso", "vendido").required().messages({
        "any.only": "El estado debe ser: en proceso o vendido",
        "any.required": "El estado es obligatorio"
      })
  })
};
