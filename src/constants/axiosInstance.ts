import axios from 'axios';
import { BASE_URL } from './api';
import { store } from '../store/store';
import { logout, updateAccessToken } from '../store/authSlice';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
let accessToken: string | null = null;
export const setAccessToken = (token: any) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('accessToken'); // ✅ always read fresh token
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
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
          `${BASE_URL}/api/auth/refreshToken`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        // localStorage.setItem('accessToken', newAccessToken);
        store.dispatch(updateAccessToken(newAccessToken))
        setAccessToken(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());

        console.error('Refresh token failed:', err.message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
