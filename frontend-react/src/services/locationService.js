import api from '../utils/api';

export const locationService = {
  getLocations: async (params = {}) => {
    const response = await api.get('/locations', { params });
    return response.data;
  },

  getLocationById: async (id) => {
    const response = await api.get(`/locations/${id}`);
    return response.data;
  },

  createLocation: async (locationData) => {
    const response = await api.post('/locations', locationData);
    return response.data;
  },

  updateLocation: async (id, locationData) => {
    const response = await api.put(`/locations/${id}`, locationData);
    return response.data;
  },

  deleteLocation: async (id) => {
    const response = await api.delete(`/locations/${id}`);
    return response.data;
  },
};
