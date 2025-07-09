import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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

export const createProducto = async (productoData) => {
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
