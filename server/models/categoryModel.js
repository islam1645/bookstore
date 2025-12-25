const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Pas de doublons (ex: pas deux fois "Coding")
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