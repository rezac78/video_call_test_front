// src/utils/axiosInstance.js
import axios from "axios";
import toast from "react-hot-toast";
import { AUTH_API_KEY, AUTH_URL } from "../config-global";

const axiosInstance = axios.create({
  baseURL: AUTH_URL,
  headers: {
    "Api-Key": AUTH_API_KEY,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired handling (e.g., log out user)
      toast.error("Session expired. Please log in again.");
      // Optionally, redirect to login or handle token expiration
      // logoutUser();
    } else if (error.response) {
      // Handle other error responses
      toast.error(error.response.data.message || "An error occurred");
    } else {
      toast.error("Network error. Please try again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
