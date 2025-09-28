import axios from 'axios'

const api = axios.create({
  baseURL: "https://backend-mern-gules.vercel.app/api/todos",
});

export default api;