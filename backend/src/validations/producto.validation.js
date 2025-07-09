import Joi from "joi";

export const productoValidation = () => Joi.object({
  nombre: Joi.string().min(2).required(),
  descripcion: Joi.string().allow("").optional(),
  precio: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  marca: Joi.string().optional(),
  tipo: Joi.string().optional()
});
