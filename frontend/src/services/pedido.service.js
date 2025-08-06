import axios from "./root.service.js";

export const getPedidos = async () => {
  try {
    const response = await axios.get('/pedidos');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createPedido = async (pedidoData) => {
  try {
    const response = await axios.post('/pedidos', pedidoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPedidoById = async (id) => {
  try {
    const response = await axios.get(`/pedidos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updatePedido = async (id, pedidoData) => {
  try {
    const response = await axios.put(`/pedidos/${id}`, pedidoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deletePedido = async (id) => {
  try {
    const response = await axios.delete(`/pedidos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
