import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    let message = data?.message;
    if (!message) {
      message = error.response
        ? `Request failed (status ${error.response.status})`
        : 'Cannot reach the server. Make sure the backend is running.';
    }
    const normalized = new Error(message);
    normalized.status = error.response?.status ?? null;
    normalized.details = Array.isArray(data?.errors) ? data.errors : [];
    return Promise.reject(normalized);
  },
);

const taskUrl = (id) => `/tasks/${encodeURIComponent(id)}`;

export const taskApi = {
  getTasks: async () => (await api.get('/tasks')).data.data,
  getTask: async (id) => (await api.get(taskUrl(id))).data.data,
  createTask: async (payload) => (await api.post('/tasks', payload)).data.data,
  updateTask: async (id, payload) => (await api.put(taskUrl(id), payload)).data.data,
  deleteTask: async (id) => (await api.delete(taskUrl(id))).data.data,
};