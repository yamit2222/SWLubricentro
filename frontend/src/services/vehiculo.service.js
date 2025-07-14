import axios from "axios";

const API_URL = 'http://localhost:3000/api';

export const vehiculoService = {
  crear: async (vehiculo) => {
    try {
      const response = await axios.post(`${API_URL}/vehiculos`, vehiculo, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  obtenerTodos: async () => {
    try {
      const response = await axios.get(`${API_URL}/vehiculos`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  obtenerPorId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/vehiculos/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  actualizar: async (id, vehiculo) => {
    try {
      const response = await axios.put(`${API_URL}/vehiculos/${id}`, vehiculo, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  eliminar: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/vehiculos/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
