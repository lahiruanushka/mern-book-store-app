import axios from 'axios';

const API_URL = 'http://localhost:5500/api';

export const getBooks = () => axios.get(`${API_URL}/books`);
export const getBook = (id) => axios.get(`${API_URL}/books/${id}`);
export const createBook = (book) => axios.post(`${API_URL}/books`, book);
export const updateBook = (id, book) => axios.put(`${API_URL}/books/${id}`, book);
export const deleteBook = (id) => axios.delete(`${API_URL}/books/${id}`);
