const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Sera smtp-relay.brevo.com
    port: Number(process.env.EMAIL_PORT), // Sera 587
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const message = {
    from: `KutubDZ <${process.env.EMAIL_USER}>`, // L'email que tu as validé sur Brevo
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  console.log("Tentative envoi SMTP...");
  await transporter.sendMail(message);
  console.log("Email envoyé !");
};

module.exports = sendEmail;