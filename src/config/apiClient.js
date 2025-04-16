import axios from 'axios';
import { API_URL } from './url';

const apiClient = axios.create({
    baseURL: API_URL,
});

export default apiClient;

apiClient.interceptors.request.use(
    async (config) => {
        if (!config.url?.includes('/token/refresh/')) {
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                void error
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const makeRequest = (method, complemento, data) => {
    switch (method) {
        case 'get': return apiClient.get(complemento);
        case 'post': return apiClient.post(complemento, data);
        case 'put': return apiClient.put(complemento, data);
        case 'delete': return apiClient.delete(complemento);
    }
};

export const peticion = async (apiClient, complemento, method = 'get', data = null) => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        const response = await makeRequest(method, complemento, data);
        return response;
    } catch (error) {
        if (error.response?.status === 401 && refreshToken) {
            try {
                const res = await axios.post(`${API_URL}/usuarios/token/refresh/`, { refresh: refreshToken });
                const newToken = res.data.access;
                localStorage.setItem('accessToken', newToken);
                return await makeRequest(method, complemento, data);
            } catch (refreshErr) {
                console.error("Error al refrescar token", refreshErr);
                localStorage.clear();
                window.location.href = "/login";
                throw refreshErr;
            }
        }
        throw error;
    }
};
