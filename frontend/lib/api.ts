import axios from "axios";

// Standard unified endpoint logic 
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Sync authentication logic seamlessly injecting dynamic Access Tokens!
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Purge completely expired tokens safely without polluting terminal loops
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Lazy load store to avoid circular issues
        const { useAuthStore } = require('@/store/authStore');
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
