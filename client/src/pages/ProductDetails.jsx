import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBookDetails } from '../redux/bookSlice';
import { addToCart } from '../redux/cartSlice'; // Assurez-vous d'avoir cette action
import { ShoppingCart, ArrowLeft, Check, Truck, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { book, isLoading, isError, message } = useSelector((state) => state.books);

  // État pour l'image principale affichée
  const [activeImage, setActiveImage] = useState('');

  // 1. Charger le livre au démarrage
  useEffect(() => {
    dispatch(getBookDetails(id));
  }, [dispatch, id]);

  // 2. Quand le livre est chargé, on met l'image de couverture comme image active par défaut
  useEffect(() => {
    if (book && book.coverImage) {
      setActiveImage(book.coverImage);
    }
  }, [book]);

  const handleAddToCart = () => {
    dispatch(addToCart(book));
    toast.success('Ajouté au panier !');
  };

  if (isLoading) return <div className="min-h-screen flex justify-center items-center text-blue-900 font-bold">Chargement...</div>;
  if (isError) return <div className="min-h-screen flex justify-center items-center text-red-500">{message}</div>;
  if (!book || !book.title) return <div className="min-h-screen flex justify-center items-center">Livre introuvable.</div>;

  // 3. On crée un tableau propre avec seulement les images qui existent
  const images = [book.coverImage, book.image2, book.image3].filter(img => img);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Bouton Retour */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-900 mb-8 transition">
            <ArrowLeft size={20} /> Retour
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
            
            {/* --- COLONNE GAUCHE : GALERIE IMAGES --- */}
            <div className="p-6 bg-gray-50 flex flex-col items-center">
                
                {/* GRANDE IMAGE */}
                <div className="w-full h-[400px] md:h-[500px] bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden mb-4">
                    <img 
                        src={activeImage} 
                        alt={book.title} 
                        className="h-full w-full object-contain p-2"
                    />
                </div>

                {/* MINIATURES (Seulement si plus d'une image) */}
                {images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2 w-full justify-center">
                        {images.map((img, index) => (
                            <button 
                                key={index} 
                                onClick={() => setActiveImage(img)}
                                className={`w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${activeImage === img ? 'border-blue-600 scale-105 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                            >
                                <img src={img} alt={`Vue ${index}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* --- COLONNE DROITE : DETAILS --- */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-wide">
                    {book.category}
                </span>
                
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-lg text-gray-500 mb-6">par <span className="text-gray-800 font-medium">{book.author}</span></p>

                {/* Prix et Stock */}
                <div className="flex items-end gap-4 mb-8 border-b border-gray-100 pb-8">
                    <span className="text-4xl font-bold text-blue-900">{book.price} DA</span>
                    {book.stock > 0 ? (
                        <span className="flex items-center gap-1 text-green-600 font-bold text-sm mb-2">
                            <Check size={16} /> En Stock ({book.stock})
                        </span>
                    ) : (
                        <span className="text-red-500 font-bold text-sm mb-2">Rupture de stock</span>
                    )}
                </div>

                {/* Description */}
                <div className="mb-8">
                    <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                        {book.description || "Aucune description disponible pour ce livre."}
                    </p>
                </div>

                {/* Bouton Action */}
                <button 
                    onClick={handleAddToCart}
                    disabled={book.stock === 0}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-1 ${book.stock > 0 ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                    <ShoppingCart /> {book.stock > 0 ? 'Ajouter au Panier' : 'Indisponible'}
                </button>

                {/* Arguments rassurance */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Truck className="text-blue-900" size={24} />
                        <div>
                            <span className="block font-bold text-gray-800">Livraison 58 Wilayas</span>
                            Rapide et sécurisée
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <ShieldCheck className="text-blue-900" size={24} />
                        <div>
                            <span className="block font-bold text-gray-800">Paiement à la livraison</span>
                            Vérifiez votre colis
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;