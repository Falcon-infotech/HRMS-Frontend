import axios from 'axios';
import { BASE_URL } from './api';
import { store } from '../store/store';

import { logout, updateAccessToken } from '../store/authSlice';
import { useEffect } from 'react';


const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
let accessToken: string | null = null;
export const setAccessToken = (token: any) => {
  accessToken = token;
};


let isRefreshing: Boolean = false
let failedQueue: any[] = []



const processQueue = (error: any, token: null | string = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

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
    console.log("entered here 401")

    if (error.response?.status === 401 &&
      error.response?.data?.message === 'TokenExpired' &&
      !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          })
      }

      originalRequest._retry = true;
      isRefreshing = true;



      try {
        console.log('Access token expired. Attempting refresh...');
        const res = await axios.post(
          `${BASE_URL}/api/auth/refreshToken`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        // console.log(newAccessToken, "new token received")
        store.dispatch(updateAccessToken(newAccessToken))
        setAccessToken(newAccessToken)
        processQueue(null, newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err: any) {
        processQueue(err, null);
        store.dispatch(logout());
        console.error('Refresh token failed:', err.message);
      } finally {
        isRefreshing = false;

      }
    }

    return Promise.reject(error);
  }
);

export default api;
