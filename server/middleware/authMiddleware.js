const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// 1. MIDDLEWARE STRICT : Bloque l'accès si l'utilisateur n'est pas connecté
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // On récupère l'user SANS son mot de passe
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('Utilisateur non trouvé');
      }
      
      next();
    } catch (error) {
      console.error("Erreur Token Protect:", error.message);
      res.status(401);
      throw new Error('Non autorisé, token invalide');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Non autorisé, pas de token fourni');
  }
});

// 2. MIDDLEWARE OPTIONNEL : Identifie l'user s'il y a un token, sinon laisse passer en "invité"
const optionalProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      if (token && token !== 'null' && token !== 'undefined') {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userFound = await User.findById(decoded.id).select('-password');
        
        if (userFound) {
          req.user = userFound;
        }
      }
    } catch (error) {
      // En cas d'erreur sur le token, on ne bloque pas, on continue simplement sans req.user
      console.log("Navigation en mode invité (Token invalide)");
    }
  }
  next();
});

// 3. MIDDLEWARE ADMIN : Bloque l'accès si l'utilisateur n'est pas Administrateur
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Action réservée aux administrateurs');
  }
};

module.exports = { protect, admin, optionalProtect };