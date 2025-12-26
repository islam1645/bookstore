const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect, admin } = require('../middleware/authMiddleware');

// Tout le monde peut LIRE les réglages
router.get('/', getSettings);

// Seul l'ADMIN peut les MODIFIER
router.put('/', protect, admin, updateSettings);

module.exports = router;