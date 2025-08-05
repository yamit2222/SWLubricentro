import Joi from "joi";

export const movimientoStockValidation = {
  registrarMovimiento: () => Joi.object({
    productoId: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'El ID del producto debe ser un número',
        'number.integer': 'El ID del producto debe ser un número entero',
        'number.positive': 'El ID del producto debe ser positivo',
        'any.required': 'El ID del producto es obligatorio'
      }),
    
    tipo: Joi.string().valid('entrada', 'salida').required()
      .messages({
        'string.base': 'El tipo debe ser una cadena de texto',
        'any.only': 'El tipo debe ser "entrada" o "salida"',
        'any.required': 'El tipo de movimiento es obligatorio'
      }),
    
    cantidad: Joi.number().integer().positive().max(9999).required()
      .messages({
        'number.base': 'La cantidad debe ser un número',
        'number.integer': 'La cantidad debe ser un número entero',
        'number.positive': 'La cantidad debe ser positiva',
        'number.max': 'La cantidad no puede exceder 9999',
        'any.required': 'La cantidad es obligatoria'
      }),
    
    observacion: Joi.string().max(500).optional().allow('', null)
      .messages({
        'string.base': 'La observación debe ser una cadena de texto',
        'string.max': 'La observación no puede exceder 500 caracteres'
      })
  }),

  obtenerMovimientosPorProducto: () => Joi.object({
    productoId: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'El ID del producto debe ser un número',
        'number.integer': 'El ID del producto debe ser un número entero',
        'number.positive': 'El ID del producto debe ser positivo',
        'any.required': 'El ID del producto es obligatorio'
      })
  })
};
