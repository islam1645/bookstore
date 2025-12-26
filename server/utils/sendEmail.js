// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Créer le transporteur (Configuration Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Ou autre service (Outlook, etc.)
    auth: {
      user: process.env.EMAIL_USER, // Ton email (dans .env)
      pass: process.env.EMAIL_PASS, // Ton mot de passe d'application (PAS ton mot de passe normal)
    },
  });

  // 2. Définir le mail
  const mailOptions = {
    from: `KutubDZ Support <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html // Tu pourras ajouter du HTML plus tard pour faire joli
  };

  // 3. Envoyer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;