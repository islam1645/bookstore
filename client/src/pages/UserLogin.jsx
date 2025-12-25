import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

const UserLogin = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-900">{t('login_page.title')}</h2>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('login_page.email')}</label>
            <div className="relative">
              <Mail className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 text-gray-400`} size={20} />
              <input 
                type="email" 
                className={`w-full ${isArabic ? 'pr-10 text-right' : 'pl-10'} py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none`}
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('login_page.password')}</label>
            <div className="relative">
              <Lock className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 text-gray-400`} size={20} />
              <input 
                type="password" 
                className={`w-full ${isArabic ? 'pr-10 text-right' : 'pl-10'} py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none`}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
            {t('login_page.submit')}
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