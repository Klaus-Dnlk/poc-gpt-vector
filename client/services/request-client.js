import axios from 'axios';

const BASE_URL = 'http://localhost:5050';

const requestClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

requestClient.interceptors.response.use(
  res => res,
  err => {
    return Promise.reject(err);
  }
);

export { requestClient };
