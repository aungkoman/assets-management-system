import api from '../utils/api';

export const regionService = {
  getRegions: async () => {
    const response = await api.get('/regions');
    return response.data;
  },

  getRegionById: async (id) => {
    const response = await api.get(`/regions/${id}`);
    return response.data;
  },

  createRegion: async (regionData) => {
    const response = await api.post('/regions', regionData);
    return response.data;
  },

  updateRegion: async (id, regionData) => {
    const response = await api.put(`/regions/${id}`, regionData);
    return response.data;
  },

  deleteRegion: async (id) => {
    const response = await api.delete(`/regions/${id}`);
    return response.data;
  },
};
