import api from './api'; 

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData); // Changed from '/register'
  return response;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials); // Changed from '/login'
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout'); // Add this line
  localStorage.removeItem('token');
  return response; // Return the response
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me'); // Changed from '/user'
  return response;
};