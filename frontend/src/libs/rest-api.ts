import axios, {AxiosRequestConfig} from "axios";

const client = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

client.interceptors.request.use(async (config: AxiosRequestConfig) => {
    config.headers = config.headers || {};
    config.headers['X-Requested-With'] = 'XMLHttpRequest';

    return config;
});

export default client;
