import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost/Digital-Marketing-app/backend-dm/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // This allows cookies/sessions if you add them later
  withCredentials: true 
});

// Interceptor to handle errors globally 
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Global logic: e.g., redirect to login if session expires
      console.error("Unauthorized! Redirecting...");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;