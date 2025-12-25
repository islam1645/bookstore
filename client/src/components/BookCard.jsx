import React from 'react';
import { useDispatch } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import { addToCart } from '../redux/cartSlice'; // Action Redux pour ajouter au panier
import { toast } from 'react-toastify';         // Notification pop-up
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const dispatch = useDispatch();

  // Vérification simple : Est-ce que le stock est à 0 ?
  const isOutOfStock = book.stock <= 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      dispatch(addToCart(book)); // Envoie le livre dans le Store Redux
      toast.success(`${book.title} ajouté au panier !`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full relative overflow-hidden group">
      
      {/* --- BADGE RUPTURE DE STOCK --- */}
      {isOutOfStock && (
        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 z-20 rounded-bl-lg shadow-sm">
          ÉPUISÉ
        </div>
      )}

      {/* --- IMAGE DU LIVRE --- */}
      <div className="h-64 w-full bg-gray-100 overflow-hidden relative">
         <img 
           src={book.coverImage} 
           alt={book.title} 
           className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`} 
           // Si l'image ne charge pas, on met une image grise par défaut
           onError={(e) => {e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'}} 
         />
      </div>
      
      {/* --- CONTENU --- */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Catégorie */}
        <div className="mb-3">
  <Link 
    to={`/category/${book.category}`} 
    className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wider hover:bg-blue-100 transition"
  >
    {book.category || 'Général'}
  </Link>
</div>
        
        {/* Titre et Auteur */}
        <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight line-clamp-2" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 font-medium">{book.author}</p>
        
        {/* --- PIED DE CARTE (Prix + Bouton) --- */}
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-xl font-extrabold text-gray-900">{book.price} DA</span>
          
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-transform active:scale-95 ${
              isOutOfStock 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-900 text-white hover:bg-blue-800 shadow-md hover:shadow-lg'
            }`}
          >
            <ShoppingCart size={18} />
            {isOutOfStock ? 'Indispo' : 'Ajouter'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookCard;