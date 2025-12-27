const Brevo = require('@getbrevo/brevo');

const sendEmail = async (options) => {
  try {
    // 1. Initialisation de l'instance
    let apiInstance = new Brevo.TransactionalEmailsApi();
    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let sendSmtpEmail = new Brevo.SendSmtpEmail();

    // 2. Extraction du Code OTP (si présent dans le message)
    // On essaie de récupérer juste le chiffre s'il est caché dans le texte
    const otpMatch = options.message.match(/\d{6}/); 
    const otpCode = otpMatch ? otpMatch[0] : "";
    const cleanMessage = options.message.replace(otpCode, '').replace(':', '').trim();

    // 3. Design HTML (Template "KutubDZ Premium")
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background-color: #1a1a1a; padding: 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
          .content { padding: 30px; color: #333333; line-height: 1.6; }
          .otp-box { 
            background-color: #f8f9fa; 
            border: 2px dashed #1a1a1a; 
            color: #1a1a1a; 
            font-size: 32px; 
            font-weight: bold; 
            text-align: center; 
            padding: 15px; 
            margin: 20px 0; 
            letter-spacing: 5px; 
            border-radius: 4px;
          }
          .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888888; }
          .btn { display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>KutubDZ</h1>
          </div>
          
          <div class="content">
            <h2>Bonjour,</h2>
            <p>${cleanMessage || "Voici votre code de vérification :"}</p>
            
            <div class="otp-box">
              ${otpCode}
            </div>
            
            <p>Ce code est valide pendant 10 minutes. Ne le partagez avec personne.</p>
            <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
          </div>

          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} KutubDZ. Tous droits réservés.</p>
            <p>Alger, Algérie</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 4. Configuration de l'envoi
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = htmlTemplate; // On injecte le HTML ici
    sendSmtpEmail.sender = { "name": "KutubDZ", "email": "saidoun.islam@gmail.com" };
    sendSmtpEmail.to = [{ "email": options.email }];

    // 5. Envoi
    console.log(`[API Brevo] Envoi template HTML à ${options.email}...`);
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`[API Brevo] Succès ! ID: ${data.messageId}`);
    return data;

  } catch (error) {
    console.error("[API Brevo] Erreur :", error.message);
    throw error;
  }
};

module.exports = sendEmail;