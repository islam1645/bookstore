import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedBooks } from '../redux/bookSlice';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeaturedCarousel = () => {
  const dispatch = useDispatch();
  const { featuredBooks } = useSelector((state) => state.books);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getFeaturedBooks());
  }, [dispatch]);

  if (!featuredBooks || featuredBooks.length === 0) return null;

  return (
    <div className="bg-blue-50 py-12 mb-10 border-y border-blue-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Titre de la section */}
        <div className="flex items-center gap-2 mb-6">
            <Star className="text-yellow-500 fill-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800">{t('home.librarian_selection')}</h2>
        </div>

        {/* Zone de défilement horizontal */}
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-hide">
          {featuredBooks.map((book) => (
            <div key={book._id} className="min-w-[200px] max-w-[200px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 snap-center flex flex-col group h-full">
              
              {/* 1. LIEN SUR L'IMAGE (Pour rendre l'image cliquable) */}
              <Link to={`/product/${book._id}`} className="block overflow-hidden rounded-t-xl h-56 relative">
                 <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                 />
                 {/* Badge Promo optionnel */}
                 <div className="absolute top-2 left-2 bg-yellow-400 text-blue-900 text-[10px] font-bold px-2 py-1 rounded shadow">
                    Top
                 </div>
              </Link>

              {/* Infos */}
              <div className="p-4 flex flex-col flex-1">
                
                {/* 2. LIEN SUR LE TITRE (Pour rendre le titre cliquable) */}
                <Link to={`/product/${book._id}`}>
                    <h3 className="font-bold text-gray-800 truncate text-sm hover:text-blue-600 transition" title={book.title}>
                        {book.title}
                    </h3>
                </Link>

                <p className="text-xs text-gray-500 mb-3 truncate">{book.author}</p>
                
                <div className="mt-auto flex justify-between items-center">
                    <span className="font-bold text-blue-900">{book.price} DA</span>
                    
                    {/* Bouton Panier (Lui aussi redirige vers le produit pour l'instant) */}
                    <Link to={`/product/${book._id}`} className="bg-blue-100 text-blue-900 p-2 rounded-full hover:bg-blue-900 hover:text-white transition">
                        <ShoppingCart size={14} />
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;