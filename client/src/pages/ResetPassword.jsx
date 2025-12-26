import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ResetPassword = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resetToken } = useParams(); // On récupère le token depuis l'URL
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Les mots de passe ne correspondent pas");
    }
    if (password.length < 8) {
      return toast.error("Le mot de passe doit faire au moins 8 caractères");
    }

    try {
      setLoading(true);
      const config = { headers: { 'Content-Type': 'application/json' } };
      
      // Attention à l'URL (Localhost pour les tests)
      await axios.put(`http://localhost:5000/api/users/reset-password/${resetToken}`, { password }, config);

      toast.success("Mot de passe modifié ! Connectez-vous.");
      navigate('/user-login');
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur, le lien est peut-être expiré.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Nouveau mot de passe</h2>
          <p className="text-gray-500 text-sm mt-2">Choisissez un mot de passe sécurisé.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
            <div className="relative">
              <Lock className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 text-gray-400`} size={20} />
              <input 
                type="password" 
                className={`w-full ${isArabic ? 'pr-10 text-right' : 'pl-10'} py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
            <div className="relative">
              <Lock className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 text-gray-400`} size={20} />
              <input 
                type="password" 
                className={`w-full ${isArabic ? 'pr-10 text-right' : 'pl-10'} py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
            {loading ? 'Modification...' : 'Valider'}
            <CheckCircle size={20}/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;