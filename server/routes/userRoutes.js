const express = require('express');
const router = express.Router();
// On importe TOUTES les fonctions, y compris resetPassword
const { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword ,
  updateUserProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
// Routes
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.route('/profile').put(protect, updateUserProfile); // La nouvelle route

module.exports = router;