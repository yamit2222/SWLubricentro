import Joi from "joi";

export const productoValidation = () => Joi.object({
  nombre: Joi.string().min(3).max(30).required(),
  codigoP: Joi.number().integer().min(4).max(10).required(),
  descripcion: Joi.string().max(500).required(),
  precio: Joi.number().positive().max(9999999).required(),
  stock: Joi.number().integer().min(0).max(9999).required(),
  marca: Joi.string().min(3).max(15).required(),
  categoria: Joi.string().valid("aceite", "filtro", "bateria").required(),
  subcategoria: Joi.string().valid("auto", "camioneta", "vehiculo comercial", "motocicleta", "maquinaria").required()
});
