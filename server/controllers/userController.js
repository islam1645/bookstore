const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Vérifier que tout est rempli
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Veuillez remplir tous les champs');
  }

  // 2. Vérifier la longueur du mot de passe
  if (password.length < 8) {
    res.status(400);
    throw new Error('Le mot de passe doit contenir au moins 8 caractères');
  }

  // 3. Vérifier si l'user existe déjà
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Cet utilisateur existe déjà');
  }

  // 4. Crypter le mot de passe
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 5. Créer l'user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin: false // Par défaut, c'est un client
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
    throw new Error('Données utilisateur invalides');
  }
});

// @desc    Se connecter (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Trouver l'utilisateur par email
  const user = await User.findOne({ email });

  // Vérifier le mot de passe
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Email ou mot de passe incorrect');
  }
});

// @desc    Mot de passe oublié (Envoi de l'email)
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Aucun utilisateur trouvé avec cet email");
  }

  // 1. Générer un token de réinitialisation
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2. Hasher le token et l'enregistrer dans la BDD
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Définir l'expiration (10 minutes)
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  // 4. Créer l'URL de réinitialisation
  // NOTE: En production, remplace localhost par ton vrai nom de domaine via process.env
  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  const message = `Vous avez demandé la réinitialisation de votre mot de passe. \n\n Veuillez cliquer sur ce lien : \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'KutubDZ - Réinitialisation du mot de passe',
      message,
    });

    res.status(200).json({ success: true, data: "Email envoyé" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error("L'email n'a pas pu être envoyé");
  }
});

// --- AJOUT ESSENTIEL CI-DESSOUS ---

// @desc    Réinitialiser le mot de passe (Validation du nouveau mdp)
// @route   PUT /api/users/reset-password/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // 1. Récupérer le token haché pour le comparer à la BDD
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // 2. Chercher l'utilisateur avec ce token ET vérification date expiration
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Token invalide ou expiré');
  }

  // 3. Vérifier la longueur du nouveau mot de passe
  if (req.body.password.length < 8) {
     res.status(400);
     throw new Error('Le mot de passe doit contenir 8 caractères minimum');
  }

  // 4. Mettre à jour le mot de passe
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  // 5. Nettoyer les champs de reset
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ success: true, data: "Mot de passe mis à jour avec succès" });
});

// Fonction utilitaire pour générer le JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
// @desc    Mettre à jour le profil utilisateur
// @route   PUT /api/users/profile
// @access  Privé (Nécessite d'être connecté)
const updateUserProfile = asyncHandler(async (req, res) => {
  // req.user est récupéré grâce au middleware 'protect' (vérification du token)
  const user = await User.findById(req.user._id);

  if (user) {
    // On met à jour le nom et l'email s'ils sont envoyés, sinon on garde l'ancien
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Si l'utilisateur envoie un nouveau mot de passe
    if (req.body.password) {
      if (req.body.password.length < 8) {
        res.status(400);
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }
      // Le hashage se fera automatiquement si tu as un middleware 'pre-save' dans ton modèle
      // Sinon, on le hash ici manuellement comme dans le register :
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
});
// N'oublie pas d'ajouter resetPassword dans l'export !
module.exports = { registerUser, loginUser, forgotPassword, resetPassword ,updateUserProfile };