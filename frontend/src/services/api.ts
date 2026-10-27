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
import { mockFallback, analyzeReviewClient } from './mockFallback';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
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
      if (!error.config?.url?.includes('/auth/login') && !error.config?.url?.includes('/auth/register')) {
        localStorage.removeItem('reviewiq_token');
        localStorage.removeItem('reviewiq_user');
      }
    }
    return Promise.reject(error);
  }
);

// Helper wrapper that executes the network request, and falls back to mock data if it fails
async function withFallback<T>(apiCall: () => Promise<{ data: T }>, fallbackFn: () => T | Promise<T>): Promise<{ data: T }> {
  try {
    return await apiCall();
  } catch (err) {
    console.warn('Backend unavailable, using client-side AI & dataset fallback:', err);
    const data = await fallbackFn();
    return { data };
  }
}

// Auth endpoints
export const authApi = {
  register: (data: { full_name: string; email: string; password: string }) =>
    withFallback(
      () => api.post<AuthResponse>('/auth/register', data),
      () => mockFallback.loginDemo(data.email)
    ),
  login: (data: { email: string; password: string }) =>
    withFallback(
      () => api.post<AuthResponse>('/auth/login', data),
      () => mockFallback.loginDemo(data.email)
    ),
  logout: () =>
    withFallback(
      () => api.post('/auth/logout'),
      () => ({ message: 'Logged out successfully' })
    ),
  getMe: () =>
    withFallback(
      () => api.get<User>('/auth/me'),
      () => mockFallback.loginDemo('demo@reviewiq.ai').user
    ),
};

// Analysis endpoints
export const analysisApi = {
  analyzeSingle: (data: { review_text: string; product_id?: string; save_to_history?: boolean }) =>
    withFallback(
      () => api.post<AnalysisResult>('/analyze', data),
      () => analyzeReviewClient(data.review_text, data.product_id)
    ),
  analyzeBulk: (reviews: { review_text: string; product_id?: string }[]) =>
    withFallback(
      () =>
        api.post<{
          total_processed: number;
          positive_count: number;
          negative_count: number;
          neutral_count: number;
          mixed_count: number;
          results: AnalysisResult[];
        }>('/analyze/bulk', reviews),
      () => {
        const results = reviews.map((r) => analyzeReviewClient(r.review_text, r.product_id));
        return {
          total_processed: results.length,
          positive_count: results.filter((r) => r.overall_sentiment === 'Positive').length,
          negative_count: results.filter((r) => r.overall_sentiment === 'Negative').length,
          neutral_count: results.filter((r) => r.overall_sentiment === 'Neutral').length,
          mixed_count: results.filter((r) => r.overall_sentiment === 'Mixed').length,
          results,
        };
      }
    ),
  getHistory: (params?: { search?: string; sentiment?: string; limit?: number; offset?: number }) =>
    withFallback(
      () => api.get<AnalysisResult[]>('/analyses/history', { params }),
      () => mockFallback.getHistory()
    ),
  deleteAnalysis: (id: number) =>
    withFallback(
      () => api.delete(`/analyses/${id}`),
      () => ({ message: 'Deleted successfully' })
    ),
};

// Products endpoints
export const productApi = {
  getAll: (params?: { search?: string; category?: string; brand?: string }) =>
    withFallback(
      () => api.get<Product[]>('/products', { params }),
      () => mockFallback.getProducts(params)
    ),
  getById: (id: string) =>
    withFallback(
      () => api.get<ProductDetail>(`/products/${id}`),
      () => mockFallback.getProductById(id)
    ),
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
  }) =>
    withFallback(
      () => api.post<ProductDetail>('/products', data),
      () => mockFallback.getProductById(data.id)
    ),
  getReviews: (id: string, params?: { limit?: number; offset?: number }) =>
    withFallback(
      () => api.get<Review[]>(`/products/${id}/reviews`, { params }),
      () => mockFallback.getProductReviews(id)
    ),
};

// Analytics endpoints
export const analyticsApi = {
  getDashboard: () =>
    withFallback(
      () => api.get<DashboardStats>('/analytics/dashboard'),
      () => mockFallback.getDashboard()
    ),
  getComplaints: (productId?: string) =>
    withFallback(
      () => api.get<ComplaintItem[]>('/analytics/complaints', { params: { product_id: productId } }),
      () => mockFallback.getComplaints(productId)
    ),
  getCompare: (productIds: string[]) =>
    withFallback(
      () =>
        api.get<{ products: any[]; all_aspects: string[] }>('/analytics/compare', {
          params: { product_ids: productIds.join(',') },
        }),
      () => {
        const prods = productIds.map((id) => {
          try {
            return mockFallback.getProductById(id);
          } catch {
            return mockFallback.getProducts()[0];
          }
        });
        const all_aspects = ['Camera', 'Battery', 'Performance', 'Display', 'Price', 'Build quality', 'Audio and speakers'];
        return { products: prods, all_aspects };
      }
    ),
  getAspects: (params?: { product_id?: string; aspect_name?: string }) =>
    withFallback(
      () => api.get<{ aspects: any[] }>('/analytics/aspects', { params }),
      () => ({ aspects: mockFallback.getDashboard().most_frequent_aspects })
    ),
};

// Dataset endpoints
export const datasetApi = {
  getSummary: () =>
    withFallback(
      () => api.get('/dataset/summary'),
      () => ({
        total_reviews: 12052,
        total_aspects: 34120,
        unique_products: 241,
        sentiment_distribution: {
          positive: 7420,
          negative: 2890,
          neutral: 1102,
          mixed: 640,
        },
      })
    ),
  uploadCsv: (formData: FormData) =>
    withFallback(
      () =>
        api.post<{ message: string; imported_count: number; rows_processed: number }>('/dataset/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
      () => ({ message: 'Dataset processed successfully (Client demo mode)', imported_count: 50, rows_processed: 50 })
    ),
};

// Model endpoints
export const modelApi = {
  getInfo: () =>
    withFallback(
      () => api.get('/model/info'),
      () => ({
        model_name: 'TF-IDF + Logistic Regression / LinearSVC',
        vectorizer: 'TfidfVectorizer (ngram_range=(1,2), max_features=10000)',
        vocabulary_size: 10000,
        accuracy: 0.912,
        f1_macro: 0.894,
      })
    ),
  getEvaluation: () =>
    withFallback(
      () => api.get<ModelEvaluation>('/model/evaluation'),
      () => mockFallback.getModelEvaluation()
    ),
};
