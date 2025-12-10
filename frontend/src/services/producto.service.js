import axios from './root.service.js';

export const getProductos = async () => {
  try {
    const response = await axios.get('/productos');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProducto = async (productoData) => {
  const categoriaValida = ["aceite", "filtro", "bateria"];
  if (!categoriaValida.includes(productoData.categoria)) {
    return Promise.reject("Categoría inválida. Debe ser aceite, filtro o bateria");
  }
  try {
    const response = await axios.post('/productos', productoData);
    return response.data;
  } catch (error) {    throw error.response?.data || error.message;
  }
};

export const updateProducto = async (id, productoData) => {
  const categoriaValida = ["aceite", "filtro", "bateria"];
  if (!categoriaValida.includes(productoData.categoria)) {
    return Promise.reject("Categoría inválida. Debe ser aceite, filtro o bateria");
  }
  try {
    const response = await axios.put(`/productos/${id}`, productoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProducto = async (id) => {
  try {
    const response = await axios.delete(`/productos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const importarProductosExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('excel', file);

    const response = await axios.post('/productos/importar-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
