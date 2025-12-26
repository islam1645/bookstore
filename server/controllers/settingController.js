const asyncHandler = require('express-async-handler');
const Setting = require('../models/settingModel');

// @desc    Récupérer les réglages du site (Public)
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
  // On cherche le premier document de réglages
  const settings = await Setting.findOne();

  if (settings) {
    res.json(settings);
  } else {
    // S'il n'existe pas encore (premier lancement), on le crée !
    const defaultSettings = await Setting.create({});
    res.json(defaultSettings);
  }
});

// @desc    Mettre à jour les réglages (Admin)
// @route   PUT /api/settings
// @access  Privé/Admin
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.findOne();

  if (settings) {
    settings.heroTitle = req.body.heroTitle || settings.heroTitle;
    settings.heroTitleAr = req.body.heroTitleAr || settings.heroTitleAr;
    settings.heroSubtitle = req.body.heroSubtitle || settings.heroSubtitle;
    settings.heroSubtitleAr = req.body.heroSubtitleAr || settings.heroSubtitleAr;
    settings.heroImage = req.body.heroImage || settings.heroImage;
    
    // Pour les booléens, on vérifie si c'est défini, sinon on garde l'ancien
    settings.showAnnouncement = req.body.showAnnouncement !== undefined ? req.body.showAnnouncement : settings.showAnnouncement;
    settings.announcementText = req.body.announcementText || settings.announcementText;
    settings.announcementTextAr = req.body.announcementTextAr || settings.announcementTextAr;

    settings.phone = req.body.phone || settings.phone;
    settings.emailContact = req.body.emailContact || settings.emailContact;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } else {
    // Au cas où (ne devrait pas arriver si getSettings est appelé avant)
    const newSettings = await Setting.create(req.body);
    res.json(newSettings);
  }
});

module.exports = { getSettings, updateSettings };