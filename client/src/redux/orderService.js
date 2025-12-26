import axios from 'axios';

// Vérifie bien que l'URL correspond à ton backend
const API_URL = 'https://bookstore-d1k4.onrender.com/api/orders/';

// Créer une nouvelle commande
const createOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, orderData, config);
  return response.data;
};

// Récupérer les commandes de l'utilisateur connecté
const getMyOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // Appel à la route: GET /api/orders/myorders
  const response = await axios.get(API_URL + 'myorders', config);
  return response.data;
};

const orderService = {
  createOrder,
  getMyOrders,
};

export default orderService;