import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
};

export const users = {
  getUser: (id) => api.get(`/users/${id}`),
  getUsers: () => api.get("/users"),
  addUser: (userData) => api.post("/users", userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const books = {
  getAll: () => api.get("/books"),
  getBook: (id) => api.get(`/books/${id}`),
  addBook: (bookData) => api.post("/books", bookData),
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  deleteBook: (id) => api.delete(`/books/${id}`),
  addRating: (id, ratingData) => api.post(`/books/${id}/rating`, ratingData),
};

export const cart = {
  get: () => api.get("/cart"),
  addItem: (bookId, quantity) =>
    api.post("/cart/add", {
      bookId,
      quantity,
    }),
  updateItem: (bookId, quantity) =>
    api.put(`/cart/item/${bookId}`, {
      quantity,
    }),
  removeItem: (bookId) => api.delete(`/cart/item/${bookId}`),
  clear: () => api.delete("/cart/clear"),
};

export const orders = {
  create: (orderData) => api.post("/orders", orderData),
  getMyOrders: () => api.get("/orders/my-orders"),
  getAllOrders: () => api.get("/orders"),
  updateStatus: (orderId, status) =>
    api.put(`/orders/${orderId}/status`, {
      status,
    }),
};

export const wishlist = {
  get: () => api.get("/wishlist"),
  addItem: (bookData) =>
    api.post("/wishlist/add", {
      bookId: bookData.bookId,
      title: bookData.title,
      price: bookData.price,
    }),
  removeItem: (bookId) => api.delete(`/wishlist/remove/${bookId}`),
};
