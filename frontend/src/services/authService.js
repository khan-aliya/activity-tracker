import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  logout: async () => {
    const response = await api.post('/logout');
    localStorage.removeItem('token');
    return response;
  },

  getProfile: async () => {
    const response = await api.get('/user');
    return response;
  }
};

export default authService;