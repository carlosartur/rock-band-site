import axios from 'axios';
import Cookies from 'js-cookie';
import { fetchCsrfToken, useCsrf } from '../context/CsrfContext';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});


const addCsrfTokenToConfig = config => {
  const csrfToken = Cookies.get('XSRF-TOKEN');

  if (!csrfToken) {
    return config;
  }

  config.headers['X-XSRF-TOKEN'] = csrfToken;

  if (!['post', 'put', 'patch', 'delete'].includes(config.method)) {
    return config;
  }
  
  if (!(config.data instanceof FormData)) {
    config.data = {
      ...config.data,
      _token: csrfToken,
    };

    return config;
  }
  
  config.data.append('_token', csrfToken);
  return config;
};

api.interceptors.request.use((config) => {

  config = addCsrfTokenToConfig(config);

  const token = Cookies.get('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

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
