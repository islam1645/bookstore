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
  console.log("1. Début registerUser pour:", email);

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Veuillez remplir tous les champs');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Cet utilisateur existe déjà');
  }

  // 4. Générer OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000;
  console.log("2. OTP généré:", otpCode);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 5. Créer l'user
  console.log("3. Tentative de création dans MongoDB...");
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: false, 
    otp: otpCode,
    otpExpires: otpExpires
  });

  if (user) {
    console.log("4. Utilisateur créé avec ID:", user._id);
    console.log("   Champs OTP en BDD:", user.otp);

    const message = `Votre code de vérification pour KutubDZ est : ${otpCode}`;
    try {
      console.log("5. Tentative d'envoi d'email via Brevo...");
      await sendEmail({
        email: user.email,
        subject: 'KutubDZ - Vérifiez votre email',
        message,
      });
      
      console.log("6. Email envoyé avec succès!");
      res.status(201).json({
        success: true,
        message: "Compte créé ! Veuillez vérifier vos emails pour le code."
      });
    } catch (error) {
      console.error("ERREUR CRITIQUE EMAIL :", error.message); 
      // On supprime l'user pour permettre de recommencer proprement
      await User.findByIdAndDelete(user._id); 
      res.status(500);
      throw new Error("Erreur d'envoi d'email : " + error.message);
    }
  } else {
    res.status(400);
    throw new Error('Données invalides');
  }
});

// @desc    Vérifier l'email avec le code OTP
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (user && user.otp === otp && user.otpExpires > Date.now()) {
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
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
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

// @desc    Mot de passe oublié
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Aucun utilisateur trouvé avec cet email");
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
  const message = `Lien de réinitialisation : \n\n ${resetUrl}`;

  try {
    await sendEmail({ email: user.email, subject: 'Réinitialisation', message });
    res.status(200).json({ success: true, data: "Email envoyé" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500);
    throw new Error("L'email n'a pas pu être envoyé");
  }
});

// @desc    Réinitialiser le mot de passe
const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

  if (!user) {
    res.status(400);
    throw new Error('Token invalide ou expiré');
  }

  if (req.body.password.length < 8) {
      res.status(400);
      throw new Error('8 caractères minimum');
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, data: "Mot de passe mis à jour" });
});

// @desc    Mettre à jour le profil
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
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

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = { 
    registerUser, 
    loginUser, 
    forgotPassword, 
    resetPassword, 
    updateUserProfile, 
    verifyEmail 
};