import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      // 🚧 DEV BYPASS: Skip refresh for fake dev tokens — just ignore the 401
      if (
        accessToken === "fake-access-token-for-testing" ||
        refreshToken === "fake-refresh-token-for-testing"
      ) {
        return Promise.reject(error);
      }

      try {
        if (!refreshToken) {
           // No refresh token, force logout
           localStorage.removeItem("accessToken");
           localStorage.removeItem("refreshToken");
           localStorage.removeItem("user");
           window.location.href = "/login";
           return Promise.reject(error);
        }

        // Try to get a new access token using the refresh token
        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        if (res.data.success) {
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed (expired or invalid), force logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
