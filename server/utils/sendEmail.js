const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,               // <--- RETOUR AU PORT 587
    secure: false,           // <--- IMPORTANT : false pour le port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false // C'est CA qui va empêcher le blocage
    }
  });

  const message = {
    from: `KutubDZ <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  console.log("Tentative connexion SMTP..."); // Log pour voir si ça démarre
  await transporter.sendMail(message);
  console.log("Email envoyé !"); // Log pour voir si ça finit
};

module.exports = sendEmail;