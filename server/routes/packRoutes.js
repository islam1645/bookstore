const express = require('express');
const router = express.Router();
const {
  createPack,
  getPacks,
  deletePack,
} = require('../controllers/packController'); // Assure-toi que ce fichier existe

// Import des middlewares de protection
const { protect, admin } = require('../middleware/authMiddleware');

// Route: /api/packs
router.route('/')
  .get(getPacks)                  // Public : Pour que les clients voient les offres
  .post(protect, admin, createPack); // Privé : Seul toi peux créer une promo

// Route: /api/packs/:id
router.route('/:id')
  .delete(protect, admin, deletePack); // Privé : Seul toi peux supprimer

module.exports = router;