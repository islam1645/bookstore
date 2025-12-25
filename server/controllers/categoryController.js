const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');

// @desc    Récupérer toutes les catégories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }); // Tri alphabétique
  res.status(200).json(categories);
});

// @desc    Ajouter une catégorie (AVEC IMAGE)
// @route   POST /api/categories
// @access  Privé (Admin)
const createCategory = asyncHandler(async (req, res) => {
  // 1. On récupère le nom ET l'image depuis la requête
  const { name, image } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Veuillez ajouter un nom de catégorie');
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error('Cette catégorie existe déjà');
  }

  // 2. On crée la catégorie avec le nom ET l'image
  const category = await Category.create({
    name: name,
    image: image || '' // Si pas d'image envoyée, on met une chaîne vide
  });

  res.status(200).json(category);
});

// @desc    Supprimer une catégorie
// @route   DELETE /api/categories/:id
// @access  Privé (Admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Catégorie non trouvée');
  }

  await category.deleteOne();
  res.status(200).json({ id: req.params.id });
});

// ---------------------------------------------------------
// NOUVELLE FONCTION : METTRE À JOUR
// ---------------------------------------------------------
// @desc    Mettre à jour une catégorie (Nom ou Image)
// @route   PUT /api/categories/:id
// @access  Privé (Admin)
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    // On met à jour le nom s'il est fourni, sinon on garde l'ancien
    category.name = req.body.name || category.name;
    // On met à jour l'image si elle est fournie, sinon on garde l'ancienne
    category.image = req.body.image || category.image;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Catégorie non trouvée');
  }
});

// N'oubliez pas d'ajouter updateCategory ici :
module.exports = { 
  getCategories, 
  createCategory, 
  deleteCategory, 
  updateCategory // <--- AJOUTÉ
};