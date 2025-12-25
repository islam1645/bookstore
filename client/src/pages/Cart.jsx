import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// IMPORTS REDUX
import { addToCart, decreaseCart, removeFromCart, resetCart } from '../redux/cartSlice';
import { createOrder } from '../redux/orderSlice'; 

// IMPORTS ICONES
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, User, Phone, MapPin } from 'lucide-react';

// IMPORT MODAL
import SuccessModal from '../components/SuccessModal';

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: ''
  });

  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) return toast.error("Votre panier est vide");
    
    if (!formData.fullName || !formData.phone || !formData.city || !formData.address) {
        return toast.error("Veuillez remplir tous les champs de livraison");
    }

    // --- CORRECTION MAJEURE ICI ---
    // On transforme _id en 'product' pour que Mongoose soit content
    const formattedOrderItems = cartItems.map((item) => ({
      product: item._id, 
      title: item.title,
      price: item.price,
      qty: item.qty,
      coverImage: item.coverImage
    }));

    const orderData = {
        orderItems: formattedOrderItems, // On envoie la liste formatée
        shippingAddress: formData,
        totalPrice: totalPrice,
        paymentMethod: 'Cash on Delivery'
    };

    try {
        await dispatch(createOrder(orderData)).unwrap();
        // Si succès :
        setShowSuccessModal(true);
    } catch (error) {
        console.error("Erreur commande :", error);
        toast.error(typeof error === 'string' ? error : "Erreur lors de la commande (Vérifiez les données envoyées).");
    }
  };

  const handleCloseModal = () => {
      setShowSuccessModal(false);
      dispatch(resetCart()); 
      navigate('/'); 
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <ShoppingBag /> Mon Panier
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold text-gray-400 mb-4">Votre panier est vide</h2>
              <Link to="/shop" className="text-blue-600 font-bold hover:underline">
                Retourner à la boutique
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LISTE DES ARTICLES */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4 flex-1">
                      <img src={item.coverImage} alt={item.title} className="w-16 h-20 object-cover rounded-md" />
                      <div>
                        <h3 className="font-bold text-gray-800">{item.title}</h3>
                        <p className="text-gray-500 text-sm">{item.price} DA</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-full">
                      <button type="button" onClick={() => dispatch(decreaseCart(item))} className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-600 hover:text-red-500">
                          <Minus size={16} />
                      </button>
                      <span className="font-bold w-4 text-center">{item.qty}</span>
                      <button type="button" onClick={() => dispatch(addToCart(item))} className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-600 hover:text-green-500">
                          <Plus size={16} />
                      </button>
                    </div>

                    <div className="font-bold text-blue-900 w-24 text-right hidden sm:block">
                      {item.qty * item.price} DA
                    </div>

                    <button type="button" onClick={() => dispatch(removeFromCart(item))} className="text-red-400 hover:text-red-600 p-2">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {/* FORMULAIRE LIVRAISON */}
              <div className="bg-white p-6 rounded-xl shadow-sm h-fit border border-blue-100 sticky top-4">
                <h2 className="text-xl font-bold mb-4 border-b pb-2 text-blue-900">Livraison</h2>
                
                <form onSubmit={handleCheckout} className="space-y-4">
                    <div className="relative">
                        <User className="absolute top-3 left-3 text-gray-400" size={18}/>
                        <input type="text" name="fullName" placeholder="Nom complet" required value={formData.fullName} onChange={handleChange} className="w-full pl-10 p-2 border rounded-lg bg-gray-50 outline-none"/>
                    </div>
                    <div className="relative">
                        <Phone className="absolute top-3 left-3 text-gray-400" size={18}/>
                        <input type="tel" name="phone" placeholder="Numéro de téléphone" required pattern="[0-9]{10}" value={formData.phone} onChange={handleChange} className="w-full pl-10 p-2 border rounded-lg bg-gray-50 outline-none"/>
                    </div>
                    <div className="relative">
                        <MapPin className="absolute top-3 left-3 text-gray-400" size={18}/>
                        <input type="text" name="city" placeholder="Wilaya / Ville" required value={formData.city} onChange={handleChange} className="w-full pl-10 p-2 border rounded-lg bg-gray-50 outline-none"/>
                    </div>
                    <textarea name="address" placeholder="Adresse complète" rows="2" required value={formData.address} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50 outline-none resize-none"></textarea>

                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between mb-6 text-xl font-bold text-gray-900">
                          <span>Total</span>
                          <span>{totalPrice} DA</span>
                        </div>
                        <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-lg transform active:scale-95 duration-200">
                          Confirmer la commande
                        </button>
                    </div>
                </form>
                
                <Link to="/shop" className="block text-center mt-4 text-sm text-gray-500 hover:text-blue-600 flex items-center justify-center gap-1">
                  <ArrowLeft size={16}/> Continuer mes achats
                </Link>
              </div>

            </div>
          )}
        </div>
      </div>

      <SuccessModal 
         isOpen={showSuccessModal} 
         onClose={handleCloseModal} 
      />
    </>
  );
};

export default Cart;