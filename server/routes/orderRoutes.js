const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  getOrderStats,
  updateOrderToDelivered, // Assurez-vous d'importer ça
  // --- IMPORT DES NOUVELLES FONCTIONS ---
  deleteOrder,
  updateOrderToConfirmed,
  updateOrderNote,
} = require('../controllers/orderController');

const { protect, admin, optionalProtect } = require('../middleware/authMiddleware');

// 1. Routes Générales
router.route('/')
    .post(optionalProtect, addOrderItems) // Accepte les invités
    .get(protect, admin, getOrders);      // Admin seulement

router.route('/myorders').get(protect, getMyOrders);
router.route('/stats').get(protect, admin, getOrderStats);

// 2. Routes avec ID (Toujours à la fin)
router.route('/:id')
    .get(protect, getOrderById)
    .delete(protect, admin, deleteOrder); // <--- Route DELETE ajoutée pour corriger le 404

// 3. Actions Spécifiques
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/confirm').put(protect, admin, updateOrderToConfirmed); // <--- Route CONFIRM ajoutée
router.route('/:id/note').put(protect, admin, updateOrderNote);           // <--- Route NOTE ajoutée

module.exports = router;