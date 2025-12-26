const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyEmail,       // <--- C'est souvent celle-ci qui manque !
  forgotPassword,
  resetPassword,
  updateUserProfile
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// Route d'inscription (Création + Envoi OTP)
router.post('/', registerUser);

// Route de vérification OTP (Nouvelle !)
router.post('/verify-email', verifyEmail);

// Route de connexion
router.post('/login', loginUser);

// Routes Mot de passe oublié
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// Route Profil (Protégée)
router.put('/profile', protect, updateUserProfile);

module.exports = router;