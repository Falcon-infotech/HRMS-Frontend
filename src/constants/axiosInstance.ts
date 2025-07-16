import axios from 'axios';
import { BASE_URL } from './api';
import { store } from '../store/store';
import { logout } from '../store/authSlice';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // ✅ always read fresh token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/refreshToken`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken); // ✅ save new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // ✅ retry with new token
        return api(originalRequest); 
      } catch (err) {
        console.error('Refresh token failed:', err.message);
        store.dispatch(logout());
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
