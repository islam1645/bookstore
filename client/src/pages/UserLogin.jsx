import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { login, reset } from '../redux/authSlice'; // Assure-toi d'importer login !

const UserLogin = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  // On récupère l'état depuis Redux
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message); // Affiche "Mot de passe incorrect" ou "Email inconnu"
    }

    // Si connecté avec succès
    if (isSuccess || user) {
      navigate('/'); // On renvoie le client vers l'accueil
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t('Veuillez remplir tous les champs'));
    } else {
      // Envoi de la connexion
      dispatch(login({ email, password }));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-900">{t('login_page.title')}</h2>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('login_page.email')}</label>
            <div className="relative">
              <Mail className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 text-gray-400`} size={20} />
              <input 
                name="email"
                type="email" 
                className={`w-full ${isArabic ? 'pr-10 text-right' : 'pl-10'} py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none`}
                placeholder="votre@email.com"
                value={email}
                onChange={onChange}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('login_page.password')}</label>
            <div className="relative">
              <Lock className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 text-gray-400`} size={20} />
              <input 
                name="password"
                type="password" 
                className={`w-full ${isArabic ? 'pr-10 text-right' : 'pl-10'} py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none`}
                placeholder="********"
                value={password}
                onChange={onChange}
              />
            </div>
          </div>

          {/* BOUTON */}
          <button 
             type="submit"
             disabled={isLoading}
             className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            {isLoading ? '...' : t('login_page.submit')}
            {isArabic ? <ArrowLeft size={20}/> : <ArrowRight size={20}/>}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-gray-600">
            {t('login_page.no_account')} 
            <Link to="/register" className="text-blue-600 font-bold hover:underline ml-1">
              {t('login_page.register_link')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;