const express = require('express');
const router = express.Router();
// 1. On importe updateCategory ici
const { 
    getCategories, 
    createCategory, 
    deleteCategory, 
    updateCategory // <--- AJOUTÉ
} = require('../controllers/categoryController');

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getCategories).post(protect, admin, createCategory);

// 2. On ajoute .put() ici pour permettre la modification
router.route('/:id')
    .delete(protect, admin, deleteCategory)
    .put(protect, admin, updateCategory); // <--- AJOUTÉ

module.exports = router;