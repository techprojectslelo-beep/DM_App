import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost/Digital-Marketing-app/backend-dm/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true 
});

// --- THE MISSING PART: REQUEST INTERCEPTOR ---
// This runs BEFORE the request leaves React
axiosClient.interceptors.request.use(
  (config) => {
    // FORCE LOG THE FULL URL
    console.log("AXIOS SENDING TO:", config.baseURL + config.url);
    
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        config.headers['X-User-Role'] = (user.role || 'staff').toLowerCase();
      } catch (e) {
        console.error("JSON Parse error in interceptor:", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Your existing Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Redirecting...");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;