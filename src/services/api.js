import axios from 'axios';

const api = axios.create({
  // Ensure the port matches and it ends with /api/moods
  baseURL: 'http://localhost:3000/api/moods' 
});

export default api;