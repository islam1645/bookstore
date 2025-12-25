import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBooks } from '../redux/bookSlice';
import { getCategories } from '../redux/categorySlice';
import BookCard from '../components/BookCard';
import { Loader, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import i18n

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // Initialisation
  
  const { books, isLoading, isError, message } = useSelector((state) => state.books);
  const { categories } = useSelector((state) => state.category);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout');

  useEffect(() => {
    dispatch(getBooks());
    dispatch(getCategories());
  }, [dispatch]);

  const filteredBooks = books ? books.filter((book) => {
    const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Tout' || book.category === selectedCategory;
    return matchSearch && matchCategory;
  }) : [];

  const isArabic = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
            {t('shop.title')}
        </h1>

        {/* --- BARRE DE RECHERCHE ET FILTRES --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Barre de Recherche : On ajuste l'icône selon la direction */}
            <div className="relative w-full md:w-1/3">
                <Search 
                    className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 text-gray-400`} 
                    size={20} 
                />
                <input 
                    type="text" 
                    placeholder={t('shop.search_placeholder')}
                    className={`w-full ${isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'} py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Boutons Catégories */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 rtl:flex-row-reverse">
                <button 
                    onClick={() => setSelectedCategory('Tout')}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${selectedCategory === 'Tout' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    {t('shop.all_categories')}
                </button>
                {categories.map((cat) => (
                    <button 
                        key={cat._id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${selectedCategory === cat.name ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>

        {/* --- RESULTATS --- */}
        {isLoading ? (
            <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-600" size={48} /></div>
        ) : isError ? (
            <div className="text-red-500 text-center">{t('shop.error')} : {message}</div>
        ) : filteredBooks.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm">
                <p className="text-xl">{t('shop.no_books')}</p>
                <button 
                    onClick={() => {setSearchTerm(''); setSelectedCategory('Tout')}} 
                    className="mt-4 text-blue-600 hover:underline flex items-center gap-2 justify-center mx-auto"
                >
                    <X size={16}/> {t('shop.reset_filters')}
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
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

      </div>
    </div>
  );
};

export default Shop;