import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_URL || 'http://localhost:5000';

// Create axios instance for backend
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (ten, email, password) => {
    const response = await apiClient.post('/auth/register', { ten, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Chat APIs
export const chatAPI = {
  sendMessage: async (question, sessionId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/chat`,
      { question, sessionId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  // Direct call to Flask AI (for testing)
  sendMessageToAI: async (question, userId) => {
    const response = await axios.post(
      `${CHATBOT_API_URL}/api/chat`,
      { question, user_id: userId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
};

// Chat History APIs
export const historyAPI = {
  getUserHistory: async (userId) => {
    const response = await apiClient.get(`/lich-su-chat/user/${userId}`);
    return response.data;
  },

  getRecentHistory: async (userId) => {
    const response = await apiClient.get(`/lich-su-chat/user/${userId}/recent`);
    return response.data;
  },

  deleteHistory: async (id) => {
    await apiClient.delete(`/lich-su-chat/${id}`);
  },
};

// University APIs
export const universityAPI = {
  getAll: async () => {
    const response = await apiClient.get('/truong');
    return response.data;
  },

  search: async (name) => {
    const response = await apiClient.get(`/truong/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },
};

// Major APIs
export const majorAPI = {
  getAll: async () => {
    const response = await apiClient.get('/nganh');
    return response.data;
  },

  search: async (name) => {
    const response = await apiClient.get(`/nganh/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },
};

// Admission Score APIs
export const admissionAPI = {
  getAll: async () => {
    const response = await apiClient.get('/diem-chuan');
    return response.data;
  },

  getByYear: async (year) => {
    const response = await apiClient.get(`/diem-chuan/nam/${year}`);
    return response.data;
  },

  search: async (truongId, nganhId, nam) => {
    const params = new URLSearchParams();
    if (truongId) params.append('truongId', truongId);
    if (nganhId) params.append('nganhId', nganhId);
    if (nam) params.append('nam', nam);
    
    const response = await apiClient.get(`/diem-chuan/search?${params.toString()}`);
    return response.data;
  },
};

export default apiClient;

