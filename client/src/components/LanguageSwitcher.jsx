import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Change la direction du site (LTR pour français, RTL pour arabe)
    document.body.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => changeLanguage('fr')} 
        className={`px-2 py-1 rounded border ${i18n.language === 'fr' ? 'bg-blue-900 text-white' : 'bg-white text-gray-700'}`}
      >
        FR
      </button>
      <button 
        onClick={() => changeLanguage('ar')} 
        className={`px-2 py-1 rounded border font-arabic ${i18n.language === 'ar' ? 'bg-blue-900 text-white' : 'bg-white text-gray-700'}`}
      >
        عربي
      </button>
    </div>
  );
};

export default LanguageSwitcher;