import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

export const getMovimientos = async () => {
  try {
    const response = await axios.get(`${API_URL}/movimientos`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createMovimiento = async (movimientoData) => {
  try {
    const response = await axios.post(`${API_URL}/movimientos`, movimientoData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
