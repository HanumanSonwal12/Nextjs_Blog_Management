import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchData = async (url) => {
  const response = await api.get(url);
  return response.data;
};

export const createData = async (url, data) => {
  const response = await api.post(url, data);
  return response.data;
};

export const updateData = async (url, data) => {
  const response = await api.put(url, data);
  return response.data;
};

export const deleteData = async (url) => {
  const response = await api.delete(url);
  return response.data;
};
