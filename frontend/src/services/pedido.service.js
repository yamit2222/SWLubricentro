import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

export const getPedidosDelDia = async () => {
  try {
    const response = await axios.get(`${API_URL}/pedidos/del-dia`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createPedido = async (pedidoData) => {
  try {
    const response = await axios.post(`${API_URL}/pedidos`, pedidoData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPedidoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/pedidos/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updatePedido = async (id, pedidoData) => {
  try {
    const response = await axios.put(`${API_URL}/pedidos/${id}`, pedidoData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deletePedido = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/pedidos/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
