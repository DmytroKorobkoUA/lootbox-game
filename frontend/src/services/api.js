import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const registerPlayer = async (username, password) => {
    return api.post('/players/register', { username, password });
};

export const loginPlayer = async (username, password) => {
    return api.post('/players/login', { username, password });
};

export const getLootboxes = async () => {
    return api.get('/lootboxes');
};

export default api;
