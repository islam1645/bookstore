const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,               // <--- ON PASSE SUR LE PORT 465
    secure: true,            // <--- VRAI (TRUE) pour le port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Cette ligne permet d'éviter les erreurs de certificats sur Render
      rejectUnauthorized: false
    }
  });

  const message = {
    from: `KutubDZ <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;