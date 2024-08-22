import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const getAuthToken = () => {
    return localStorage.getItem('token');
};

api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const registerPlayer = async (username, password) => {
    return api.post('/players/register', { username, password });
};

export const loginPlayer = async (username, password) => {
    const response = await api.post('/players/login', { username, password });

    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response;
};

export const createLootboxes = async () => {
    return api.post('/lootboxes/create');
};

export const getLootboxes = async () => {
    return api.get('/lootboxes');
};

export default api;
