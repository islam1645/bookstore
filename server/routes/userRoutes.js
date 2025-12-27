const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  getUsers,           // Ajouté pour le dashboard
  toggleUserStatus    // Ajouté pour activer/bloquer
} = require('../controllers/userController');

// Import des middlewares : protect (connecté) et admin (est administrateur)
const { protect, admin } = require('../middleware/authMiddleware');

// --- ROUTES PUBLIQUES ---
router.post('/', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// --- ROUTES PRIVÉES (Utilisateur connecté) ---
router.put('/profile', protect, updateUserProfile);

// --- ROUTES ADMIN (Toi uniquement) ---
// Récupérer tous les utilisateurs pour ton Dashboard
router.get('/', protect, admin, getUsers);

// Autoriser ou bloquer un compte manuellement
router.put('/:id/status', protect, admin, toggleUserStatus);

module.exports = router;