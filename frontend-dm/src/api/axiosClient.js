import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost/Digital-Marketing-app/backend-dm/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true 
});

/**
 * PRODUCTION AUTH INTERCEPTOR
 * This attaches the secure token to every single request automatically.
 */
axiosClient.interceptors.request.use(
  (config) => {
    // 1. Get the token we saved during login
    const token = localStorage.getItem('token');
    
    // 2. If it exists, attach it as a Bearer token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 [API Request] ${config.method?.toUpperCase()} -> ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 3. Handle security failures globally
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401 || status === 403) {
        console.error("🛑 Security Block: Unauthorized or Invalid Token.");
        // Optional: Redirect to login if the token is dead
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;