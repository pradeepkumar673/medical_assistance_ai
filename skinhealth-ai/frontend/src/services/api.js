import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV ? '' : 'http://localhost:5000', // In dev, Vite proxy forwards to Flask
  withCredentials: true,
});

export default api;