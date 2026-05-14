import axios from 'axios';

const api = axios.create({
 // baseURL: 'https://localhost:7052/api ', 
 baseURL: '/api',

  timeout: 5000, 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default api;