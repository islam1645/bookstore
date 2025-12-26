import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getBooks } from '../redux/bookSlice';
import { getCategories } from '../redux/categorySlice'; // 1. Import de l'action catégorie
import BookCard from '../components/BookCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const { books, isLoading } = useSelector((state) => state.books);
  // 2. On récupère aussi les catégories pour trouver la traduction
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    if (books.length === 0) {
      dispatch(getBooks());
    }
    // 3. On charge les catégories si elles ne sont pas là
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, books.length, categories.length]);

  const filteredBooks = books.filter(
    (book) => book.category.toLowerCase() === categoryName.toLowerCase()
  );

  // 4. On cherche l'objet catégorie qui correspond à l'URL (ex: "Science")
  const currentCategory = categories.find(c => c.name === categoryName);

  // 5. On détermine le nom à afficher (Arabe ou Français)
  const displayTitle = isArabic && currentCategory?.nameAr 
    ? currentCategory.nameAr 
    : categoryName;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
          {isArabic ? (
            <><ArrowRight size={20} className="ml-2" /> {t('category_page.back_home')}</>
          ) : (
            <><ArrowLeft size={20} className="mr-2" /> {t('category_page.back_home')}</>
          )}
        </Link>

        <div className="flex items-center gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 capitalize">
                {t('category_page.category_label')} <span className="text-blue-600">{displayTitle}</span>
            </h1>
            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-bold" dir="ltr">
                {filteredBooks.length} {t('categories.books_count', { count: filteredBooks.length })}
            </span>
        </div>

        {isLoading ? (
          <div className="text-center py-20">{t('category_page.loading')}</div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-xl text-gray-500">{t('category_page.no_books')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;