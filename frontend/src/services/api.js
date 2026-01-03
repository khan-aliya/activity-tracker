import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add token to requests if exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    register: async (userData) => {
        try {
            const response = await api.post('/register', userData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            return response;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await api.post('/logout');
            return response;
        } catch (error) {
            throw error;
        }
    },

    getUser: async () => {
        try {
            const response = await api.get('/user');
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export const activityService = {
    getAll: async (params = {}) => {
    try {
        const response = await api.get('/activities', { params });
        return response;
    } catch (error) {
        throw error;
    }
},

    create: async (activity) => {
        try {
            const response = await api.post('/activities', activity);
            return response;
        } catch (error) {
            throw error;
        }
    },

    update: async (id, activity) => {
        try {
            const response = await api.put(`/activities/${id}`, activity);
            return response;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/activities/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // getStats: async () => {
    //     try {
    //         const response = await api.get('/stats');
    //         return response;
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    getCategories: async () => {
        try {
            const response = await api.get('/categories');
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default api;