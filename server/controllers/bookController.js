const asyncHandler = require('express-async-handler');
const Book = require('../models/book');

// @desc    Récupérer tous les livres
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.status(200).json(books);
});

// @desc    Récupérer UNIQUEMENT les livres "Sélection du Libraire"
// @route   GET /api/books/featured
// @access  Public
const getFeaturedBooks = asyncHandler(async (req, res) => {
    // On cherche ceux où isFeatured est true.
    // On limite à 8 pour ne pas casser le design si vous en sélectionnez trop.
    const books = await Book.find({ isFeatured: true }).sort({ updatedAt: -1 }).limit(8);
    res.json(books);
});

// @desc    Ajouter un livre
// @route   POST /api/books
// @access  Privé (Admin)
const createBook = asyncHandler(async (req, res) => {
  if (!req.body.title || !req.body.price) {
    res.status(400);
    throw new Error('Merci de remplir les champs obligatoires');
  }

  const book = await Book.create({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    price: req.body.price,
    buyPrice: req.body.buyPrice,
    category: req.body.category,
    stock: req.body.stock,
    coverImage: req.body.coverImage,
    image2: req.body.image2,
    image3: req.body.image3,
    // On ajoute le champ isFeatured ici aussi
    isFeatured: req.body.isFeatured || false, 
  });

  res.status(200).json(book);
});

// @desc    Mettre à jour un livre
// @route   PUT /api/books/:id
// @access  Privé (Admin)
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Livre non trouvé');
  }

  // req.body contient automatiquement isFeatured quand on clique sur l'étoile
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedBook);
});

// @desc    Supprimer un livre
// @route   DELETE /api/books/:id
// @access  Privé (Admin)
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Livre non trouvé');
  }

  await book.deleteOne();
  res.status(200).json({ id: req.params.id });
});

// @desc    Récupérer un seul livre par ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error('Livre non trouvé');
  }
});

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getBookById,
  getFeaturedBooks, // <--- N'oubliez pas l'export ici !
};