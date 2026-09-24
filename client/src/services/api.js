import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

if (
  typeof window !== 'undefined' &&
  !import.meta.env.VITE_API_URL &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
) {
  console.warn(
    '⚠ [Mahati Backend Warning]: VITE_API_URL is not defined in this environment! The app is attempting to reach http://localhost:5000/api. Please configure VITE_API_URL (e.g., https://your-backend.onrender.com/api) in your deployment settings.'
  );
}

// Request interceptor to attach JWT token for admin endpoints
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mtc_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated admin session
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('mtc_admin_token');
      localStorage.removeItem('mtc_admin_user');
    }
    return Promise.reject(error);
  }
);

// Products API
export const fetchProducts = (params = {}) => api.get('/products', { params });
export const fetchProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const updateStock = (id, sku, data) => api.patch(`/products/${id}/variants/${sku}/stock`, data);

// Orders API
export const createOrder = (orderData) => api.post('/orders', orderData);
export const fetchOrders = (params = {}) => api.get('/orders', { params });
export const fetchOrderById = (id) => api.get(`/orders/${id}`);
export const lookupCustomerOrders = (query) => api.get('/orders/track/lookup', { params: { query } });
export const verifyOrderPayment = (id, utrNumber) => api.put(`/orders/${id}/verify`, { utrNumber });
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const createWalkInSale = (saleData) => api.post('/orders/walkin', saleData);

// Auth API
export const loginAdmin = (credentials) => api.post('/auth/login', credentials);
export const getAdminProfile = () => api.get('/auth/me');

// Upload API (Cloudinary)
export const checkUploadStatus = () => api.get('/upload/status');
export const uploadProductImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api;
