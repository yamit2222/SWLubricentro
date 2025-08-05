import Joi from "joi";

export const subproductoValidation = () => Joi.object({
  nombre: Joi.string().min(2).max(15).required(), 
  codigosubP: Joi.number().min(2).max(10).required(),
  descripcion: Joi.string().min(5).max(50).required(),
  precio: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  marca: Joi.string().min(3).max(15).required(),
  categoria: Joi.string().valid("repuestos", "limpieza", "accesorios externos", "accesorios eléctricos").required()
});
