const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');

// @desc    Récupérer toutes les catégories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json(categories);
});

// @desc    Ajouter une catégorie (AVEC IMAGE + ARABE)
// @route   POST /api/categories
// @access  Privé (Admin)
const createCategory = asyncHandler(async (req, res) => {
  // 1. On récupère TOUT : nom FR, nom AR, et image
  const { name, nameAr, image } = req.body;

  // Validation : On exige le Français et l'Arabe
  if (!name || !nameAr) {
    res.status(400);
    throw new Error('Veuillez ajouter le nom en Français et en Arabe');
  }

  // Vérifier doublon (sur le nom français)
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error('Cette catégorie existe déjà');
  }

  // 2. On crée la catégorie
  const category = await Category.create({
    name: name,       // Français
    nameAr: nameAr,   // Arabe (Ajouté)
    image: image || '' // Image (Gardé)
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

// @desc    Mettre à jour une catégorie (Nom FR, Nom AR, Image)
// @route   PUT /api/categories/:id
// @access  Privé (Admin)
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    // Mise à jour conditionnelle : on garde l'ancien si le nouveau n'est pas envoyé
    category.name = req.body.name || category.name;
    category.nameAr = req.body.nameAr || category.nameAr; // <--- Mise à jour Arabe
    category.image = req.body.image || category.image;    // <--- Mise à jour Image

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Catégorie non trouvée');
  }
});

module.exports = { 
  getCategories, 
  createCategory, 
  deleteCategory, 
  updateCategory 
};