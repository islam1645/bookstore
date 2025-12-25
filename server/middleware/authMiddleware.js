const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Middleware Strict (Bloque si pas connecté)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Non autorisé, token invalide');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Non autorisé, pas de token');
  }
});

// --- NOUVEAU MIDDLEWARE : SOUPLE (Accepte Invités et Membres) ---
const optionalProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // On vérifie seulement si le token n'est pas une chaine vide ou "null"
      if (token && token !== 'null' && token !== 'undefined') {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.id).select('-password');
      }
    } catch (error) {
      // Si le token est invalide, on ne fait rien (on continue en tant qu'invité)
      console.log("Token invité ignoré");
    }
  }
  // Dans tous les cas, on passe à la suite !
  next();
});
// ---------------------------------------------------------------

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Non autorisé comme admin');
  }
};

// N'oubliez pas d'exporter optionalProtect
module.exports = { protect, admin, optionalProtect };