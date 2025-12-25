const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// @desc    Enregistrer un nouvel utilisateur (Pour créer votre 1er admin)
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Veuillez remplir tous les champs');
  }

  // Vérifier si l'user existe déjà
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Utilisateur déjà existant');
  }

  // Crypter le mot de passe
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Créer l'user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin: true // ATTENTION : Mettez 'true' juste pour créer votre premier compte Admin, ensuite remettez 'false'
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Données invalides');
  }
};

// @desc    Se connecter (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Trouver l'utilisateur par email
  const user = await User.findOne({ email });

  // Vérifier le mot de passe (comparer ce qui est saisi avec le crypté)
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin, // Important pour le Frontend (afficher Dashboard ou non)
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Identifiants invalides');
  }
};

// Fonction utilitaire pour générer le JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Le token expire dans 30 jours
  });
};

module.exports = { registerUser, loginUser };