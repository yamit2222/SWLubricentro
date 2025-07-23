import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

export const getProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/productos`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cambia los valores válidos a singular para coincidir con backend
export const createProducto = async (productoData) => {
  const categoriaValida = ["aceite", "filtro", "bateria"];
  if (!categoriaValida.includes(productoData.categoria)) {
    return Promise.reject("Categoría inválida. Debe ser aceite, filtro o bateria");
  }
  try {
    const response = await axios.post(`${API_URL}/productos`, productoData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProducto = async (id, productoData) => {
  const categoriaValida = ["aceite", "filtro", "bateria"];
  if (!categoriaValida.includes(productoData.categoria)) {
    return Promise.reject("Categoría inválida. Debe ser aceite, filtro o bateria");
  }
  try {
    const response = await axios.put(`${API_URL}/productos/${id}`, productoData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProducto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/productos/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
