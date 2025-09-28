import axios from 'axios'

const api = axios.create({
  baseURL: "/api/todos",
});

export default api;