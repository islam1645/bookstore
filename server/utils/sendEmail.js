const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Créer le transporteur avec configuration EXPLICITE
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',     // On force l'adresse de Gmail
    port: 587,                  // On force le port 587 (Standard TLS)
    secure: false,              // false pour le port 587 (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Cette option est MAGIQUE pour Render : elle évite les erreurs de certificats
    tls: {
      rejectUnauthorized: false
    }
  });

  // 2. Définir le mail
  const mailOptions = {
    from: `KutubDZ Support <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Envoyer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;