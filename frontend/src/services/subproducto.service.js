import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getSubProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/subproductos`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createSubProducto = async (subproductoData) => {
  try {
    const response = await axios.post(`${API_URL}/subproductos`, subproductoData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateSubProducto = async (id, subproductoData) => {
  try {
    const response = await axios.put(`${API_URL}/subproductos/${id}`, subproductoData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteSubProducto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/subproductos/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
