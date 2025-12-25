import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapPin, Phone, User, CheckCircle, Loader } from 'lucide-react';

// --- IMPORTS REDUX ---
import { createOrder, resetOrder } from '../redux/orderSlice';
import { resetCart } from '../redux/cartSlice'; // Assurez-vous que c'est bien 'resetCart' dans cartSlice

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Récupération du Panier
  const { cartItems } = useSelector((state) => state.cart);
  
  // Calcul du total sécurisé
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  // 2. Récupération de l'état Commande (Ajout de isLoading)
  const { isSuccess, isError, message, isLoading } = useSelector((state) => state.order);

  // 3. État local du formulaire
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
  });

  const { fullName, address, city, phone } = formData;

  // --- GESTION DES EFFETS (Succès / Erreur) ---
  useEffect(() => {
    if (isSuccess) {
      toast.success('Commande validée avec succès !');
      
      dispatch(resetCart());  // <--- CORRECTION : Utilisation de resetCart
      dispatch(resetOrder()); // Remise à zéro de l'état commande
      
      navigate('/'); // Redirection accueil
    }

    if (isError) {
      toast.error(message || "Une erreur est survenue");
      dispatch(resetOrder()); // Reset l'erreur pour permettre de réessayer
    }
  }, [isSuccess, isError, message, navigate, dispatch]);

  // --- GESTION DU FORMULAIRE ---
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    // Préparation des données pour le Backend (Mapping _id -> product)
    const formattedOrderItems = cartItems.map((item) => ({
      product: item._id, // Important pour Mongoose
      title: item.title,
      price: item.price,
      qty: item.qty,
      coverImage: item.coverImage // Optionnel : utile si vous voulez garder l'image dans la commande
    }));

    const orderData = {
      orderItems: formattedOrderItems,
      shippingAddress: {
        fullName,
        address,
        city,
        phone,
      },
      totalPrice,
      paymentMethod: 'Cash on Delivery'
    };

    // Envoi de la commande
    dispatch(createOrder(orderData));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <MapPin className="text-blue-600" /> Informations de Livraison
          </h2>
          
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="text" name="fullName" value={fullName} onChange={onChange} required 
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Votre nom" 
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="tel" name="phone" value={phone} onChange={onChange} required 
                  pattern="[0-9]{10}"
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="05 55 ..." 
                />
              </div>
            </div>

            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya / Ville</label>
              <input 
                type="text" name="city" value={city} onChange={onChange} required 
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Ex: Alger" 
              />
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Complète</label>
              <textarea 
                name="address" value={address} onChange={onChange} required 
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none" 
                placeholder="Rue, Bâtiment, etc." 
              />
            </div>

            {/* BOUTON DE SOUMISSION */}
            <button 
              type="submit" 
              disabled={isLoading} // Désactive le bouton pendant le chargement
              className={`w-full py-3 rounded-lg font-bold text-white transition shadow-md flex justify-center items-center gap-2 ${
                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'
              }`}
            >
              {isLoading ? (
                <><Loader className="animate-spin" size={20} /> Traitement...</>
              ) : (
                <><CheckCircle size={20} /> Confirmer la Commande</>
              )}
            </button>
          </form>
        </div>

        {/* --- COLONNE DROITE : RÉSUMÉ --- */}
        <div className="bg-white p-8 rounded-xl shadow-sm h-fit border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Résumé de la commande</h2>
          
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.qty}x</span>
                    <span className="text-gray-800 truncate max-w-[150px]" title={item.title}>{item.title}</span>
                </div>
                <span className="font-medium text-blue-900">{item.price * item.qty} DA</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between items-center text-xl font-bold text-blue-900">
            <span>Total à payer</span>
            <span>{totalPrice} DA</span>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center bg-blue-50 p-2 rounded border border-blue-100">
            Paiement à la livraison (Cash on Delivery)
          </p>
        </div>

      </div>
    </div>
  );
};

export default PlaceOrder;