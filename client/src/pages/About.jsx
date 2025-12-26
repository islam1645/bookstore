import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Truck, Users, Heart, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HEADER / BANNIÈRE */}
      <div className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('about.title')}
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* SECTION HISTOIRE & MISSION */}
        <div className={`flex flex-col md:flex-row gap-12 items-center mb-20 ${isArabic ? 'md:flex-row-reverse' : ''}`}>
          
          {/* Image illustrative */}
          <div className="w-full md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Bookshelf" 
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
            />
          </div>

          {/* Texte */}
          <div className={`w-full md:w-1/2 space-y-8 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
            
            {/* Notre Histoire */}
            <div>
              <div className={`flex items-center gap-3 mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <BookOpen size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{t('about.story_title')}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {t('about.story_text')}
              </p>
            </div>

            {/* Notre Mission */}
            <div>
              <div className={`flex items-center gap-3 mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <Heart size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{t('about.mission_title')}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {t('about.mission_text')}
              </p>
            </div>

          </div>
        </div>

        {/* SECTION VALEURS (GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" dir={isArabic ? 'rtl' : 'ltr'}>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">{t('about.values.quality')}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
              <Truck size={32} />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">{t('about.values.delivery')}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">{t('about.values.community')}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-4">
              <BookOpen size={32} />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">{t('about.values.support')}</h3>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AboutPage;