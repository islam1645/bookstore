const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Enregistrer un nouvel utilisateur (Avec OTP)
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

  // 4. Générer OTP et Hacher MDP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 5. Créer l'user (Non vérifié)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: false, 
    otp: otpCode,
    otpExpires: Date.now() + 10 * 60 * 1000 // Expire dans 10 min
  });

  if (user) {
    // Envoyer l'email
    const message = `Votre code de vérification pour KutubDZ est : ${otpCode}`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'KutubDZ - Vérifiez votre email',
        message,
      });
      
      res.status(201).json({
        success: true,
        message: "Compte créé ! Veuillez vérifier vos emails pour le code."
      });
    } catch (error) {
      // --- CORRECTION CRUCIALE ICI ---
      // On affiche l'erreur exacte dans la console (Visible dans les Logs Render)
      console.error("ERREUR DÉTAILLÉE NODEMAILER :", error); 

      await User.findByIdAndDelete(user._id); // On supprime l'user si l'email échoue
      res.status(500);
      // On renvoie le message technique pour t'aider à débugger
      throw new Error("Erreur d'envoi d'email : " + error.message);
    }
  } else {
    res.status(400);
    throw new Error('Données invalides');
  }
});

// @desc    Vérifier l'email avec le code OTP
// @route   POST /api/users/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (user && user.otp === otp && user.otpExpires > Date.now()) {
    // Validation réussie
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Code invalide ou expiré");
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
    
    // VÉRIFICATION OTP ICI
    if (!user.isVerified) {
       res.status(401);
       throw new Error("Veuillez d'abord vérifier votre email.");
    }

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
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

  const message = `Vous avez demandé la réinitialisation de votre mot de passe. \n\n Veuillez cliquer sur ce lien : \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'KutubDZ - Réinitialisation du mot de passe',
      message,
    });

    res.status(200).json({ success: true, data: "Email envoyé" });
  } catch (error) {
    console.error("Erreur Reset Password Email:", error); // Ajout log ici aussi
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error("L'email n'a pas pu être envoyé");
  }
});

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

// @desc    Mettre à jour le profil utilisateur
// @route   PUT /api/users/profile
// @access  Privé