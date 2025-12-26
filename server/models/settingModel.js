const mongoose = require('mongoose');

const settingSchema = mongoose.Schema({
  // --- SECTION BANNIÈRE (HERO) ---
  heroTitle: { type: String, default: "Bienvenue sur KutubDZ" },
  heroTitleAr: { type: String, default: "مرحبًا بكم في KutubDZ" },
  
  heroSubtitle: { type: String, default: "La meilleure librairie en ligne en Algérie" },
  heroSubtitleAr: { type: String, default: "أفضل مكتبة إلكترونية في الجزائر" },
  
  heroImage: { type: String, default: "https://images.unsplash.com/photo-1507842217121-9e87bd229f83" }, // Image par défaut

  // --- BARRE D'ANNONCE (Tout en haut) ---
  showAnnouncement: { type: Boolean, default: false }, // Afficher ou cacher
  announcementText: { type: String, default: "Livraison gratuite à partir de 5000 DA" },
  announcementTextAr: { type: String, default: "توصيل مجاني ابتداء من 5000 دج" },

  // --- CONTACTS (Pour le footer ou le haut) ---
  phone: { type: String, default: "0550 00 00 00" },
  emailContact: { type: String, default: "contact@kutubdz.com" },

}, {
  timestamps: true,
});

module.exports = mongoose.model('Setting', settingSchema);