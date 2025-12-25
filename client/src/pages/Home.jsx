import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getBooks } from '../redux/bookSlice';
import BookCard from '../components/BookCard';
import { Loader, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'; // J'ai ajouté ArrowLeft pour l'arabe
import FeaturedCarousel from '../components/FeaturedCarousel';
import { useTranslation } from 'react-i18next'; // <--- 1. Import Important

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // <--- 2. On active la traduction
  
  const { books, isLoading, isError, message } = useSelector((state) => state.books);

  useEffect(() => {
    if (books.length === 0) {
      dispatch(getBooks());
    }
  }, [dispatch, books.length]);

  const latestBooks = books ? books.slice(0, 8) : [];
  const isArabic = i18n.language === 'ar'; // Pour savoir si on doit inverser les flèches

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- 1. BANNIÈRE HERO --- */}
      <div className="bg-blue-900 text-white py-20 px-6 text-center shadow-lg">
        {/* On utilise t('hero.title') au lieu du texte en dur */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('hero.title')}</h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
          {t('hero.subtitle')}
        </p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-md">
          {t('hero.button')} 
          {/* Si c'est arabe, on met la flèche vers la gauche, sinon vers la droite */}
          {isArabic ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
        </Link>
      </div>
      
      {/* --- 2. CAROUSEL SÉLECTION --- */}
      <FeaturedCarousel />

      {/* --- 3. SECTION NOUVEAUTÉS --- */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex items-center justify-between mb-8 border-b pb-4">
            <div className="flex items-center gap-2">
                <Sparkles className="text-yellow-500" fill="currentColor" />
                <h2 className="text-2xl font-bold text-gray-800">{t('home.latest_arrivals')}</h2>
            </div>
            <Link to="/shop" className="text-blue-600 font-bold hover:underline hidden md:block">
                {t('home.view_more')}
            </Link>
        </div>

        {/* Grille des livres */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-600" size={48} /></div>
        ) : isError ? (
          <div className="text-red-500 text-center">{t('home.error')} : {message}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestBooks.map((book) => (
              <div 
                key={book._id} 
                onClick={() => navigate(`/product/${book._id}`)} 
                className="block h-full group cursor-pointer"
              >
                 <BookCard book={book} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
            <Link to="/shop" className="inline-block border-2 border-blue-900 text-blue-900 px-6 py-2 rounded-lg font-bold">
                {t('home.view_all_btn')}
            </Link>
        </div>

      </div>
    </div>
  );
};

export default Home;