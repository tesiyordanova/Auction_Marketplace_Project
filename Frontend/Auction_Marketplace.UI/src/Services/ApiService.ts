import axios, { AxiosRequestConfig } from 'axios';
import { getToken } from '../utils/GoogleToken';

class ApiService {
    private baseUrl = import.meta.env.VITE_BASE_URL;

    private async handleResponse(response: any) {
        return response.data;
    }

    private async request<T>(config: AxiosRequestConfig): Promise<T> {
        try {
            const response = await axios(config);
            return this.handleResponse(response);
        } catch (error: any) {
            console.error('API request error:', error);
            throw new Error(error.response?.data.errorMessage || 'An error occurred');
        }
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>({
            method: 'get',
            headers: {"Authorization": `Bearer ${getToken()}`},
            url: `${this.baseUrl}/${endpoint}`,
        });
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        console.log(data);
        return this.request<T>({
            method: 'post',
            headers: {"Authorization": `Bearer ${getToken()}`},
            url: `${this.baseUrl}/${endpoint}`,
            data,
        });
    }

    async put<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>({
            method: 'put',
            headers: {"Authorization": `Bearer ${getToken()}`},
            url: `${this.baseUrl}/${endpoint}`,
            data,
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>({
            method: 'delete',
            headers: {"Authorization": `Bearer ${getToken()}`},
            url: `${this.baseUrl}/${endpoint}`,
        });
    }
}

export default ApiService;