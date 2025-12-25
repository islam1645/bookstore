import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';

const UserRegister = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-900">{t('register_page.title')}</h2>
        </div>

        <form className="space-y-5">
          {/* CHAMP NOM */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('register_page.name')}</label>
            <div className="relative">
              <User className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 text-gray-400`} size={20} />
              <input 
                name="name"
                type="text" 
                className={`w-full ${isArabic ? 'pr-10 text-right' : 'pl-10'} py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none`}
                placeholder="Ex: Mohamed Amine"
                value={name}
                onChange={onChange}
              />
            </div>
          </div>

          {/* CHAMP EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('register_page.email')}</label>
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

          {/* CHAMP MOT DE PASSE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('register_page.password')}</label>
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

          {/* BOUTON VALIDER */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-4">
            {t('register_page.submit')}
            {isArabic ? <ArrowLeft size={20}/> : <ArrowRight size={20}/>}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-gray-600">
            {t('register_page.already_have_account')} 
            <Link to="/user-login" className="text-blue-600 font-bold hover:underline ml-1">
               {t('login_page.submit')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;