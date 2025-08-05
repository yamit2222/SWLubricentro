import Joi from "joi";

export const subproductoValidation = () => Joi.object({
  nombre: Joi.string().min(3).max(50).required(),
  codigosubP: Joi.number().integer().min(1000).max(9999999999).required(),
  descripcion: Joi.string().min(10).max(300).required(),
  precio: Joi.number().positive().min(1).max(9999999).required(),
  stock: Joi.number().integer().min(0).max(9999).required(),
  marca: Joi.string().min(3).max(30).required(),
  categoria: Joi.string().valid("repuestos", "limpieza", "accesorios externos", "accesorios eléctricos").required()
});
