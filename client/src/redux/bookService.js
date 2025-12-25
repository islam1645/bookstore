import axios from 'axios';

const API_URL = 'https://bookstore-d1k4.onrender.com/api/books/';

// 1. Créer un livre (Route Protégée)
const createBook = async (bookData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // On accroche le badge Admin
    },
  };
  const response = await axios.post(API_URL, bookData, config);
  return response.data;
};

// 2. Récupérer tous les livres (Public)
const getBooks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// 3. Supprimer un livre (Route Protégée)
const deleteBook = async (bookId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + bookId, config);
  return response.data;
};

const bookService = {
  createBook,
  getBooks,
  deleteBook,
};

export default bookService;