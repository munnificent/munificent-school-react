import axios from 'axios';

// Создаем экземпляр axios с базовым URL из .env файла
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Это "перехватчик" запросов. Он будет автоматически добавлять
// токен аутентификации в заголовок каждого запроса, если токен есть.
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;