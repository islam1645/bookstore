import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCategories } from '../redux/categorySlice';
import { Library, Hash, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import i18n

const AllCategories = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation(); // Initialisation
  const { categories: dbCategories, isLoading } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const isArabic = i18n.language === 'ar';

  // Option statique adaptée pour la traduction
  const allBooksOption = {
    name: t('all_categories_page.all_books_title'),
    path: '/shop',
    icon: <Library size={40} />,
    color: 'bg-gray-900 text-white',
    desc: t('all_categories_page.all_books_desc')
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête traduit */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('all_categories_page.title')}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t('all_categories_page.subtitle')}
          </p>
        </div>
        
        {isLoading ? (
             <p className="text-center text-gray-500">{t('all_categories_page.loading')}</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* 1. Carte "Tous les livres" (Statique mais traduite) */}
            <Link 
                to={allBooksOption.path} 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-center text-center group h-full"
            >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-sm ${allBooksOption.color} group-hover:scale-110 transition-transform duration-300`}>
                    {allBooksOption.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {allBooksOption.name}
                </h2>
                <p className="text-gray-500 text-xs leading-relaxed">{allBooksOption.desc}</p>
            </Link>

            {/* 2. Cartes Dynamiques */}
            {dbCategories.map((cat) => {
                return (
                  <Link 
                    key={cat._id} 
                    to={`/category/${cat.name}`} 
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-center text-center group h-full"
                  >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-sm bg-gray-50 overflow-hidden group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                        {cat.image ? (
                            <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className="w-full h-full object-cover" 
                            />
                        ) : (
                            <Hash size={32} className="text-gray-400" />
                        )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {cat.name}
                    </h2>
                    
                    {/* Description générique avec variable dynamique name */}
                    <p className="text-gray-500 text-xs leading-relaxed">
                        {t('all_categories_page.browse_collection', { name: cat.name })}
                    </p>

                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
                        {isArabic ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                    </div>
                  </Link>
                );
            })}
            </div>
        )}

      </div>
    </div>
  );
};

export default AllCategories;