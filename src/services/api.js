import axios from 'axios';

const api = axios.create({
  // Pointing to your Node server's API prefix
  baseURL: 'http://localhost:3000/api' 
});

export default api;