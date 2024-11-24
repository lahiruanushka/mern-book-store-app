import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData)
};

export const books = {
  getAll: () => api.get('/books'),
  addBook: (bookData) => api.post('/books', bookData),
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  addRating: (id, ratingData) => api.post(`/books/${id}/rating`, ratingData)
};

export const cart = {
  get: () => api.get('/cart'),
  addItem: (bookId, quantity) => api.post('/cart/add', { bookId, quantity }),
  updateItem: (bookId, quantity) => api.put(`/cart/item/${bookId}`, { quantity }),
  removeItem: (bookId) => api.delete(`/cart/item/${bookId}`),
  clear: () => api.delete('/cart/clear')
};

export const orders = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  updateStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status })
};


