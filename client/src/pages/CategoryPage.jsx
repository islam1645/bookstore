import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getBooks } from '../redux/bookSlice';
import BookCard from '../components/BookCard';
import { ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
  const { categoryName } = useParams(); // Récupère le paramètre de l'URL
  const dispatch = useDispatch();

  // On récupère les livres
  const { books, isLoading } = useSelector((state) => state.books);

  useEffect(() => {
    // Si la liste est vide (si on arrive directement sur cette page), on charge les livres
    if (books.length === 0) {
      dispatch(getBooks());
    }
  }, [dispatch, books.length]);

  // FILTRAGE : On compare la catégorie du livre avec celle de l'URL
  // On utilise toLowerCase() pour éviter les erreurs (Tech vs tech)
  const filteredBooks = books.filter(
    (book) => book.category.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation retour */}
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
          <ArrowLeft size={20} className="mr-2" /> Retour à l'accueil
        </Link>

        {/* Titre */}
        <div className="flex items-center gap-4 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 capitalize">
                Catégorie : <span className="text-blue-600">{categoryName}</span>
            </h1>
            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                {filteredBooks.length} livres
            </span>
        </div>

        {/* Grille de livres */}
        {isLoading ? (
          <p>Chargement...</p>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-xl text-gray-500">Aucun livre trouvé dans cette catégorie pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;