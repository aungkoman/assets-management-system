import api from '../utils/api';

export const userService = {
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  softDeleteUser: async (id) => {
    const response = await api.patch(`/users/${id}/soft-delete`);
    return response.data;
  },

  hardDeleteUser: async (id) => {
    const response = await api.delete(`/users/${id}/hard-delete`);
    return response.data;
  },
};
