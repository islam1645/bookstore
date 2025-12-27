const asyncHandler = require('express-async-handler');
const Pack = require('../models/packModel'); // Vérifie que tu as bien créé le modèle aussi !

// @desc    Créer un nouveau Pack
// @route   POST /api/packs
// @access  Private/Admin
const createPack = asyncHandler(async (req, res) => {
  const { name, products, promoPrice, originalPrice } = req.body;

  if (!products || products.length < 2) {
    res.status(400);
    throw new Error('Il faut au moins 2 livres pour faire un pack');
  }

  const pack = await Pack.create({
    name,
    products,
    originalPrice,
    promoPrice
  });

  res.status(201).json(pack);
});

// @desc    Récupérer les Packs
// @route   GET /api/packs
// @access  Public
const getPacks = asyncHandler(async (req, res) => {
  // .populate('products') permet de récupérer les infos complètes des livres (titre, image)
  const packs = await Pack.find({}).populate('products'); 
  res.json(packs);
});

// @desc    Supprimer un Pack
// @route   DELETE /api/packs/:id
// @access  Private/Admin
const deletePack = asyncHandler(async (req, res) => {
  const pack = await Pack.findById(req.params.id);

  if (pack) {
    await pack.deleteOne();
    res.json({ message: 'Pack supprimé' });
  } else {
    res.status(404);
    throw new Error('Pack introuvable');
  }
});

module.exports = {
  createPack,
  getPacks,
  deletePack,
};