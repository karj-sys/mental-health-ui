import axios from 'axios';

const api = axios.create({
  // Pointing to your Node server's API prefix
  baseURL: 'https://mental-health-ui-drax.onrender.com' 
});

export default api;