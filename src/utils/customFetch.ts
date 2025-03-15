import axios from 'axios';

// Cria uma instância do axios com configurações padrão
const customFetch = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001', // URL base da sua API
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para tratamento global de erros
customFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default customFetch; 