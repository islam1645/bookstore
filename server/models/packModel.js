const mongoose = require('mongoose');

const packSchema = mongoose.Schema({
  name: { type: String, required: true }, // Ex: "Pack Développement Web"
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', // Lien vers tes livres existants
    required: true 
  }],
  originalPrice: { type: Number, required: true }, // Prix total réel (ex: 4000 DA)
  promoPrice: { type: Number, required: true },    // Prix promo (ex: 3500 DA)
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Pack', packSchema);