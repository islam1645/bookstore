import axios from 'axios';

const API_URL = 'https://bookstore-d1k4.onrender.com/api/books/';

// Connexion utilisateur
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    // On sauvegarde l'utilisateur (et son token) dans le navigateur
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Déconnexion
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  login,
  logout,
};

export default authService;