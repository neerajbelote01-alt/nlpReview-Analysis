import axios from 'axios';
import {
  AuthResponse,
  User,
  AnalysisResult,
  Product,
  ProductDetail,
  Review,
  DashboardStats,
  ComplaintItem,
  ModelEvaluation
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('reviewiq_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle unauthenticated responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect on login attempt failures
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('reviewiq_token');
        localStorage.removeItem('reviewiq_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  register: (data: { full_name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get<User>('/auth/me'),
};

// Analysis endpoints
export const analysisApi = {
  analyzeSingle: (data: { review_text: string; product_id?: string; save_to_history?: boolean }) =>
    api.post<AnalysisResult>('/analyze', data),
  analyzeBulk: (reviews: { review_text: string; product_id?: string }[]) =>
    api.post<{
      total_processed: number;
      positive_count: number;
      negative_count: number;
      neutral_count: number;
      mixed_count: number;
      results: AnalysisResult[];
    }>('/analyze/bulk', reviews),
  getHistory: (params?: { search?: string; sentiment?: string; limit?: number; offset?: number }) =>
    api.get<AnalysisResult[]>('/analyses/history', { params }),
  deleteAnalysis: (id: number) => api.delete(`/analyses/${id}`),
};

// Products endpoints
export const productApi = {
  getAll: (params?: { search?: string; category?: string; brand?: string }) =>
    api.get<Product[]>('/products', { params }),
  getById: (id: string) => api.get<ProductDetail>(`/products/${id}`),
  create: (data: {
    id: string;
    name: string;
    brand?: string;
    category: string;
    price?: string;
    image_url?: string;
    amazon_url?: string;
    flipkart_url?: string;
    official_url?: string;
    description?: string;
  }) => api.post<ProductDetail>('/products', data),
  getReviews: (id: string, params?: { limit?: number; offset?: number }) =>
    api.get<Review[]>(`/products/${id}/reviews`, { params }),
};

// Analytics endpoints
export const analyticsApi = {
  getDashboard: () => api.get<DashboardStats>('/analytics/dashboard'),
  getComplaints: (productId?: string) =>
    api.get<ComplaintItem[]>('/analytics/complaints', { params: { product_id: productId } }),
  getCompare: (productIds: string[]) =>
    api.get<{ products: any[]; all_aspects: string[] }>('/analytics/compare', {
      params: { product_ids: productIds.join(',') },
    }),
  getAspects: (params?: { product_id?: string; aspect_name?: string }) =>
    api.get<{ aspects: any[] }>('/analytics/aspects', { params }),
};

// Dataset endpoints
export const datasetApi = {
  getSummary: () => api.get('/dataset/summary'),
  uploadCsv: (formData: FormData) =>
    api.post('/dataset/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Model endpoints
export const modelApi = {
  getInfo: () => api.get('/model/info'),
  getEvaluation: () => api.get<ModelEvaluation>('/model/evaluation'),
};
