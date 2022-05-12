import axios, {AxiosRequestConfig} from "axios";
import Cookies from "js-cookie";
import {AccessTokenKey} from "@/libs/consts";

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

    const atk = Cookies.get(AccessTokenKey);
    if (atk) {
        config.headers['Authorization'] = `Bearer ${atk}`;
    }

    return config;
});

export default client;
