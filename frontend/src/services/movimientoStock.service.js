import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
