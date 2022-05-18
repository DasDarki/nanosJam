import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import Cookies from "js-cookie";
import {AccessTokenKey} from "@/libs/consts";
import {DateTime} from "luxon";

export const transformer = (data: {_dates: []}) => {
    if (data) {
        if (typeof data === "object") {
            const keys = Object.keys(data);

            if (data._dates) {
                data._dates.forEach(key => {
                    if (data[key]) {
                        // @ts-ignore
                        data[key] = DateTime.fromISO(data[key])
                    }
                });
            }

            for (let key of keys) {
                // @ts-ignore
                data[key] = transformer(data[key]);
            }
        } else if (Array.isArray(data)) {
            (<[]>data).forEach((item, index) => {
                // @ts-ignore
                data[index] = transformer(item);
            });
        }
    }
    return data;
};

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

client.interceptors.response.use((response: AxiosResponse) => {
    response.data = transformer(response.data);

    return response;
});

export default client;
