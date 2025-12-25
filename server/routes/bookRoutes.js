const express = require('express');
const router = express.Router();
const { 
    getBooks, 
    createBook, 
    deleteBook, 
    updateBook, 
    getBookById, 
    getFeaturedBooks // Assurez-vous que c'est bien importé
} = require('../controllers/bookController');

const { protect, admin } = require('../middleware/authMiddleware');

// 1. Route racine (Tout récupérer / Créer)
router.route('/').get(getBooks).post(protect, admin, createBook);

// ---------------------------------------------------------
// 2. IMPORTANT : Route Spécifique "Featured" 
// (Elle doit être AVANT la route /:id)
// ---------------------------------------------------------
router.get('/featured', getFeaturedBooks); 

// 3. Route Dynamique par ID (/:id)
// (Elle doit être en DERNIER, sinon elle "mange" le mot featured)
router.route('/:id')
    .get(getBookById)
    .delete(protect, admin, deleteBook)
    .put(protect, admin, updateBook);

module.exports = router;