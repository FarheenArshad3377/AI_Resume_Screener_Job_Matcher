import axiosInstance from './axiosInstance';

export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};
export const changePassword = async (data) => {
  const response = await axiosInstance.put('/auth/change-password', data);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.put('/auth/profile', data);
  return response.data;
};