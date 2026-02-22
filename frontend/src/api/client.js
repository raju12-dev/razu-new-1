import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// Determine base URL dynamically (for local dev, it assumes backend runs on port 5000)
// You might want to configure this via environment variables later.
const baseURL = 'https://razu-new-1.onrender.com';

const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the auth token
apiClient.interceptors.request.use(
    (config) => {
        const user = useAuthStore.getState().user;
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
