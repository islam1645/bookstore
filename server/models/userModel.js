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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);