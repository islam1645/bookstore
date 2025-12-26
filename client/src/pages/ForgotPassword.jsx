import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Veuillez entrer votre email");

    try {
      setLoading(true);
      
      // APPEL RÉEL AU SERVEUR
      // Assure-toi que l'URL correspond bien à ton port backend (souvent 5000 ou via le proxy)
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Si tu as un proxy dans vite.config.js, utilise juste '/api/users/forgot-password'
      // Sinon utilise l'URL complète :
      const API_URL = 'http://localhost:5000/api/users/forgot-password';
      // ou 'http://localhost:5000/api/users/forgot-password' si tu testes en local

      await axios.post(API_URL, { email }, config);

      toast.success(isArabic ? "تم إرسال رابط إعادة تعيين كلمة المرور" : "Email envoyé ! Vérifiez votre boîte de réception.");
      setEmail(''); // On vide le champ
      setLoading(false);
      
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de l'envoi";
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">
            {isArabic ? 'نسيت كلمة المرور؟' : 'Mot de passe oublié ?'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isArabic ? 'أدخل بريدك الإلكتروني لاستعادة حسابك' : 'Entrez votre email pour recevoir le lien de réinitialisation.'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('register_page.email')}</label>
            <div className="relative">
              <Mail className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 text-gray-400`} size={20} />
              <input 
                type="email" 
                className={`w-full ${isArabic ? 'pr-10 text-right' : 'pl-10'} py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
            {loading ? 'Envoi en cours...' : (isArabic ? 'إرسال الرابط' : 'Envoyer le lien')}
            {isArabic ? <ArrowLeft size={20}/> : <ArrowRight size={20}/>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/user-login" className="text-gray-600 hover:text-blue-600 font-medium">
            {isArabic ? 'العودة إلى تسجيل الدخول' : 'Retour à la connexion'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;