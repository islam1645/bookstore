const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', // On force l'hôte Brevo
    port: 465,
    secure: true, 
    auth: {
      // ICI on utilise les variables techniques pour se CONNECTER
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const message = {
    // ICI on met ton VRAI email pour l'ENVOI (Visible par le client)
    // Remplace bien 'saidoun.islam@gmail.com' par ton email si différent
    from: `KutubDZ <saidoun.islam@gmail.com>`, 
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  console.log("Connexion SMTP avec User:", process.env.EMAIL_USER); // Log de debug
  await transporter.sendMail(message);
  console.log("Email envoyé avec succès !");
};

module.exports = sendEmail;