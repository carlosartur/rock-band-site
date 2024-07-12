import axios from 'axios';
import Cookies from 'js-cookie';
import { fetchCsrfToken, useCsrf } from '../context/CsrfContext';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const csrfToken = Cookies.get('XSRF-TOKEN');
  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
    
    if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
      config.data = {
        ...config.data,
        _token: csrfToken,
      };
    }
  }

  const token = Cookies.get('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  console.log(config)

  return config;
});

api.interceptors.response.use(
  (response) => {
    fetchCsrfToken();

    const newToken = response.headers['new-token'];
    if (newToken) {
      Cookies.set('token', newToken);
    }
    return response;
  },
  (error) => {
    fetchCsrfToken();

    return Promise.reject(error);
  }
);

export default api;
