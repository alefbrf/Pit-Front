import axios from 'axios';
import { getToken } from '../auth/authentication';

let baseURL = 'https://pit-back-11bm.onrender.com/api';

if (window.location.href.includes('localhost')) {
  baseURL = 'http://localhost:5044/api'
}

const api =  axios.create({
  baseURL: baseURL,
  headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const Token = getToken();
  if (Token) {
    config.headers.Authorization = `Bearer ${Token}`;
  }
  return config;
});

api.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  }
)

export default api;