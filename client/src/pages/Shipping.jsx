import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../redux/cartSlice'; // On importe la nouvelle action
import { MapPin, ArrowRight } from 'lucide-react';

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((state) => state.cart);

  // On pré-remplit le formulaire si l'adresse existe déjà
  const [formData, setFormData] = useState({
    fullName: shippingAddress.fullName || '',
    address: shippingAddress.address || '',
    city: shippingAddress.city || '',
    postalCode: shippingAddress.postalCode || '',
    phone: shippingAddress.phone || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // 1. On sauvegarde l'adresse dans Redux
    dispatch(saveShippingAddress(formData));
    // 2. On redirige vers l'étape suivante : PlaceOrder
    navigate('/placeorder');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><MapPin className="text-blue-900"/> Adresse de Livraison</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nom Complet" required className="w-full border p-2 rounded" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          <input type="text" placeholder="Téléphone" required className="w-full border p-2 rounded" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <input type="text" placeholder="Adresse (Rue, Quartier...)" required className="w-full border p-2 rounded" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
             <input type="text" placeholder="Ville" required className="w-full border p-2 rounded" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
             <input type="text" placeholder="Code Postal" className="w-full border p-2 rounded" value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} />
          </div>

          <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded font-bold hover:bg-blue-800 flex justify-center items-center gap-2">
            Continuer <ArrowRight size={20}/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;