const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    buyPrice: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    
    // --- GESTION DES IMAGES ---
    coverImage: { type: String, required: true },
    image2: { type: String },
    image3: { type: String },
    // --------------------------

    isBestSeller: { type: Boolean, default: false },
    
    // --- AJOUTEZ CECI ---
    isFeatured: { type: Boolean, default: false }, // Pour la sélection manuelle
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);