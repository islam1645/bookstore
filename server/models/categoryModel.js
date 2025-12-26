const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Pas de doublons (ex: pas deux fois "Coding")
    },
    nameAr: {
    type: String,
    required: true, // On rend ce champ obligatoire aussi
    default: "بدون عنوان" // Valeur par défaut au cas où
  },
    image: {
    type: String,
    required: false, // Pas obligatoire, on mettra une image par défaut si vide
    default: ''
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);