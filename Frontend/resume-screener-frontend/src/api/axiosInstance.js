import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5286/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: har request se pehle token attach karo (agar available hai)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: agar token expire/invalid ho (401), to login pe redirect karo
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;