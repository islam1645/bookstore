const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // <--- ON UTILISE LE PRÉRÉGLAGE INTERNE
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // On garde ça pour éviter les problèmes de certificats
    tls: {
      rejectUnauthorized: false
    }
  });

  const message = {
    from: `KutubDZ <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  console.log("Tentative envoi via Service Gmail...");
  await transporter.sendMail(message);
  console.log("Email envoyé !");
};

module.exports = sendEmail;