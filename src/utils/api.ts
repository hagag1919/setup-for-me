import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  App,
  CreateAppRequest,
  UpdateAppRequest,
  SuccessResponse,
  WingetSearchResult,
} from '../types';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/signup', data);
    return response.data;
  },
};

// Apps API
export const appsAPI = {
  getApps: async (): Promise<App[]> => {
    const response: AxiosResponse<App[]> = await api.get('/apps');
    return response.data;
  },

  createApp: async (data: CreateAppRequest): Promise<App> => {
    const response: AxiosResponse<App> = await api.post('/apps', data);
    return response.data;
  },

  updateApp: async (id: number, data: UpdateAppRequest): Promise<App> => {
    const response: AxiosResponse<App> = await api.put(`/apps/${id}`, data);
    return response.data;
  },

  deleteApp: async (id: number): Promise<void> => {
    await api.delete(`/apps/${id}`);
  },

  generateScript: async (): Promise<SuccessResponse<{ script: string }>> => {
    const response: AxiosResponse<SuccessResponse<{ script: string }>> = await api.get('/apps/script');
    return response.data;
  },
};

// Winget API
export const wingetAPI = {
  search: async (q: string): Promise<WingetSearchResult[]> => {
    const response: AxiosResponse<WingetSearchResult[]> = await api.get(`/winget/search`, {
      params: { q },
    });
    return response.data;
  },
};

export { api };