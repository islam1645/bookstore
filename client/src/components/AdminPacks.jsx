import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Gift, Trash2, Plus, CheckSquare, Square, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminPacks = () => {
  const [products, setProducts] = useState([]); // Liste de tous les livres
  const [packs, setPacks] = useState([]);       // Liste des packs existants
  
  // Formulaire de création
  const [packName, setPackName] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [selectedIds, setSelectedIds] = useState([]); // IDs des livres cochés

  const { token } = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // 1. Charger les données (Livres et Packs)
  const fetchData = async () => {
    try {
      const { data: productsData } = await axios.get('/api/books'); 
      // Note: Assure-toi que la route /api/packs existe bien côté serveur (packRoutes.js)
      const { data: packsData } = await axios.get('/api/packs');       
      setProducts(productsData);
      setPacks(packsData);
    } catch (error) {
      console.error("Erreur chargement packs", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Gérer la sélection (Cocher/Décocher)
  const handleCheck = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id)); // Enlever
    } else {
      setSelectedIds([...selectedIds, id]); // Ajouter
    }
  };

  // 3. Calcul automatique du prix original
  const calculateOriginalPrice = () => {
    return products
      .filter(p => selectedIds.includes(p._id))
      .reduce((acc, item) => acc + item.price, 0);
  };

  // 4. Créer le pack
  const submitHandler = async (e) => {
    e.preventDefault();
    if (selectedIds.length < 2) return toast.error("Sélectionne au moins 2 livres !");
    if (!packName || !promoPrice) return toast.error("Remplis tous les champs !");

    try {
      await axios.post('/api/packs', {
        name: packName,
        products: selectedIds,
        originalPrice: calculateOriginalPrice(),
        promoPrice: Number(promoPrice)
      }, config);
      
      toast.success("Pack Promo Créé !");
      // Reset du formulaire
      setPackName('');
      setPromoPrice('');
      setSelectedIds([]);
      fetchData(); // Rafraîchir la liste
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  // 5. Supprimer un pack
  const deleteHandler = async (id) => {
    if(window.confirm("Supprimer ce pack ?")) {
      try {
        await axios.delete(`/api/packs/${id}`, config);
        toast.success("Pack supprimé");
        fetchData();
      } catch (error) {
        toast.error("Erreur suppression");
      }
    }
  };

  return (
    <div className="space-y-8">
      
      {/* --- FORMULAIRE DE CRÉATION --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-yellow-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Gift className="text-yellow-500" /> Créer une nouvelle offre
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Colonne Gauche : Sélection des livres */}
            <div>
                <h3 className="font-bold text-sm text-gray-500 mb-2 uppercase">1. Sélectionne les livres (Min. 2)</h3>
                <div className="max-h-60 overflow-y-auto border rounded-lg p-2 bg-gray-50 space-y-1">
                    {products.map(product => (
                        <div 
                            key={product._id} 
                            onClick={() => handleCheck(product._id)}
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${selectedIds.includes(product._id) ? 'bg-blue-100 border-blue-200' : 'hover:bg-white'}`}
                        >
                            {selectedIds.includes(product._id) 
                                ? <CheckSquare size={18} className="text-blue-600" /> 
                                : <Square size={18} className="text-gray-400" />
                            }
                            <div className="flex-1 text-sm font-medium">{product.title}</div>
                            <div className="text-xs text-gray-500 font-bold">{product.price} DA</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Colonne Droite : Prix et Validation */}
            <div className="space-y-4">
                <h3 className="font-bold text-sm text-gray-500 mb-2 uppercase">2. Configure le prix</h3>
                
                <div>
                    <label className="text-xs font-bold text-gray-500">Nom du Pack</label>
                    <input 
                        type="text" 
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-400 outline-none" 
                        value={packName} 
                        onChange={(e) => setPackName(e.target.value)} 
                        placeholder="Ex: Pack Débutant (Livre A + Livre B)" 
                    />
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Valeur Réelle :</span>
                        <span className="line-through">{calculateOriginalPrice()} DA</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="font-bold text-gray-800">Prix Promo :</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                className="w-24 border p-1 rounded font-bold text-green-600 text-right" 
                                value={promoPrice} 
                                onChange={(e) => setPromoPrice(e.target.value)} 
                            />
                            <span className="text-sm font-bold">DA</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={submitHandler} 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition shadow-md"
                >
                    <Save size={20} /> Enregistrer le Pack
                </button>
            </div>
        </div>
      </div>

      {/* --- LISTE DES PACKS ACTIFS --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Packs Actifs</h2>
        {packs.length === 0 ? (
            <p className="text-gray-500 italic text-center py-6">Aucun pack promo actif.</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr className="text-gray-600 text-sm uppercase">
                            <th className="p-4">Nom du Pack</th>
                            <th className="p-4">Livres inclus</th>
                            <th className="p-4">Prix Promo</th>
                            <th className="p-4">Économie</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {packs.map(pack => (
                            <tr key={pack._id} className="hover:bg-yellow-50 transition">
                                <td className="p-4 font-bold text-gray-800">{pack.name}</td>
                                <td className="p-4">
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {pack.products.map(p => (
                                            <li key={p._id}>{p.title || p.name}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="p-4 font-bold text-green-600 text-lg">{pack.promoPrice} DA</td>
                                <td className="p-4">
                                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">
                                        -{Math.round(((pack.originalPrice - pack.promoPrice) / pack.originalPrice) * 100)}%
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                                        onClick={() => deleteHandler(pack._id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminPacks;