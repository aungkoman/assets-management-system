import api from '../utils/api';

export const townshipService = {
  getTownships: async () => {
    const response = await api.get('/townships');
    return response.data;
  },

  getTownshipById: async (id) => {
    const response = await api.get(`/townships/${id}`);
    return response.data;
  },

  createTownship: async (townshipData) => {
    const response = await api.post('/townships', townshipData);
    return response.data;
  },

  updateTownship: async (id, townshipData) => {
    const response = await api.put(`/townships/${id}`, townshipData);
    return response.data;
  },

  deleteTownship: async (id) => {
    const response = await api.delete(`/townships/${id}`);
    return response.data;
  },
};
