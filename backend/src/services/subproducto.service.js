import { SubProducto } from "../entity/subproducto.entity.js";
import { subproductoExcelValidation } from "../validations/subproducto.validation.js";

export const subproductoService = {
  async crearSubproducto(data) {
    const nuevo = await SubProducto.create(data);
    return nuevo;
  },

  async obtenerSubproductos() {
    const subproductos = await SubProducto.findAll();
    return subproductos;
  },

  async obtenerSubproductoPorId(id) {
    const subproducto = await SubProducto.findByPk(id);
    if (!subproducto) {
      const error = new Error("Subproducto no encontrado");
      error.statusCode = 404;
      throw error;
    }
    return subproducto;
  },

  async modificarSubproducto(id, data) {
    if ('stock' in data) {
      delete data.stock;
    }
    const subproducto = await SubProducto.findByPk(id);
    if (!subproducto) {
      const error = new Error("Subproducto no encontrado");
      error.statusCode = 404;
      throw error;
    }
    await subproducto.update(data);
    return subproducto;
  },

  async eliminarSubproducto(id) {
    const subproducto = await SubProducto.findByPk(id);
    if (!subproducto) {
      const error = new Error("Subproducto no encontrado");
      error.statusCode = 404;
      throw error;
    }
    await subproducto.destroy();
    return true;
  },

  async importarSubproductosDesdeExcel(datosExcel) {
    const subproductosCreados = [];
    const errores = [];

    for (let i = 0; i < datosExcel.length; i++) {
      const fila = i + 2; 
      const subproducto = datosExcel[i];

      try {
        // Limpiar y procesar los datos (stock se establece automáticamente en 0)
        const subproductoLimpio = {
          nombre: typeof subproducto.nombre === 'string' ? subproducto.nombre.replace(/\s+/g, ' ').trim() : '',
          codigosubP: this.procesarCodigo(subproducto.codigosubP),
          descripcion: typeof subproducto.descripcion === 'string' ? subproducto.descripcion.replace(/\s+/g, ' ').trim() : '',
          precio: this.procesarPrecio(subproducto.precio),
          stock: 0, // Stock inicial siempre 0 para subproductos importados
          marca: typeof subproducto.marca === 'string' ? subproducto.marca.replace(/\s+/g, ' ').trim().toLowerCase() : '',
          categoria: typeof subproducto.categoria === 'string' ? subproducto.categoria.replace(/\s+/g, ' ').trim().toLowerCase() : ''
        };

        // Validar el subproducto
        const { error } = subproductoExcelValidation().validate(subproductoLimpio);
        if (error) {
          errores.push({
            fila,
            errores: error.details.map(err => err.message),
            datos: subproducto,
            datosLimpios: subproductoLimpio
          });
          continue;
        }

        // Verificar si ya existe un subproducto con el mismo código
        const subproductoExistente = await SubProducto.findOne({ 
          where: { codigosubP: subproductoLimpio.codigosubP } 
        });

        if (subproductoExistente) {
          errores.push({
            fila,
            errores: [`Ya existe un subproducto con el código ${subproductoLimpio.codigosubP}`],
            datos: subproducto,
            datosLimpios: subproductoLimpio
          });
          continue;
        }

        // Crear el subproducto
        const nuevoSubproducto = await SubProducto.create(subproductoLimpio);
        subproductosCreados.push(nuevoSubproducto);

      } catch (error) {
        errores.push({
          fila,
          errores: [`Error inesperado: ${error.message}`],
          datos: subproducto
        });
      }
    }
    return {
      subproductosCreados: subproductosCreados.length,
      errores: errores
    };
  },

  procesarCodigo(codigo) {
    if (typeof codigo === 'number') return Math.floor(codigo);
    if (typeof codigo === 'string') {
      const codigoNumerico = parseInt(codigo.replace(/[^\d]/g, ''));
      return isNaN(codigoNumerico) ? null : codigoNumerico;
    }
    return null;
  },

  procesarPrecio(precio) {
    if (typeof precio === 'number') return Math.floor(precio);
    if (typeof precio === 'string') {
      const precioNumerico = parseInt(precio.replace(/[^\d]/g, ''));
      return isNaN(precioNumerico) ? null : precioNumerico;
    }
    return null;
  }
};
