const Brevo = require('@getbrevo/brevo');

const sendEmail = async (options) => {
  try {
    // 1. On crée une instance directe de l'API Transactionnelle
    let apiInstance = new Brevo.TransactionalEmailsApi();

    // 2. On configure la clé API directement sur cette instance
    // Note: C'est 'apiKey' (camelCase) et non 'api-key'
    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    // 3. Préparation de l'email
    let sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = `
      <html>
        <body>
          <h1>Bonjour ${options.email.split('@')[0]},</h1>
          <p>${options.message}</p>
          <p>Cordialement,<br/>L'équipe KutubDZ</p>
        </body>
      </html>
    `;
    sendSmtpEmail.sender = { "name": "KutubDZ", "email": "saidoun.islam@gmail.com" };
    sendSmtpEmail.to = [{ "email": options.email }];

    // 4. Envoi
    console.log(`[API Brevo] Tentative d'envoi à ${options.email}...`);
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log(`[API Brevo] Succès ! ID Message: ${data.messageId}`);
    return data;

  } catch (error) {
    console.error("[API Brevo] ERREUR :", error.body ? error.body : error.message);
    // On relance l'erreur pour que le controller sache que ça a échoué
    throw new Error("Echec de l'envoi email via API");
  }
};

module.exports = sendEmail;