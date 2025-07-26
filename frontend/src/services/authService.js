import api from './api.js';
export const login = async ({ username, password }) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  const response = await api.post('/auth/token', formData);
  return response.data;
};
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};