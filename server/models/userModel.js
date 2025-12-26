const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ajoutez un nom'],
    },
    email: {
      type: String,
      required: [true, 'Ajoutez un email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Ajoutez un mot de passe'],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // Par défaut, un utilisateur n'est pas admin
    },
    isVerified: { type: Boolean, default: false }, // Par défaut, il n'est pas vérifié
    // ----OTP--------
    otp: { type: String }, // Le code temporaire
    otpExpires: { type: Date }, // Date d'expiration du code
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);