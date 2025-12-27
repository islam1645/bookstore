const Brevo = require('@getbrevo/brevo');

const sendEmail = async (options) => {
  try {
    let defaultClient = Brevo.ApiClient.instance;
    
    // Configuration de la clé API
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new Brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new Brevo.SendSmtpEmail();

    // Configuration de l'email
    sendSmtpEmail = {
      sender: { name: "KutubDZ", email: "saidoun.islam@gmail.com" },
      to: [{ email: options.email }],
      subject: options.subject,
      textContent: options.message,
    };

    console.log(`[API Brevo] Tentative d'envoi à : ${options.email}`);
    
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log(`[API Brevo] Succès ! ID: ${data.messageId}`);
    return data;
  } catch (error) {
    console.error("[API Brevo] Erreur d'envoi :");
    // Affiche plus de détails sur l'erreur retournée par Brevo
    console.error(error.response ? error.response.body : error.message);
    throw new Error("L'email n'a pas pu être envoyé via l'API.");
  }
};

module.exports = sendEmail;