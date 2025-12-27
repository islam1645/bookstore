import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getBooks, deleteBook, createBook, updateBook } from '../redux/bookSlice';
import { getAllOrders, markAsDelivered, markAsConfirmed, getOrderStats, deleteOrder, updateNote } from '../redux/orderSlice';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../redux/categorySlice';
import { toast } from 'react-toastify';

// --- IMPORTS ICONES ---
import { 
  Plus, Trash2, Package, Book, Truck, CheckCircle, Clock, PhoneCall, 
  Tags, List, Pencil, X, BarChart3, TrendingUp, Wallet, Banknote, 
  StickyNote, Image as ImageIcon, Star, ShoppingBag, Globe, Users, Gift 
} from 'lucide-react';

// --- IMPORTS GRAPHIQUES ---
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- IMPORTS DES NOUVEAUX MODULES (Créés précédemment) ---
// Si tu n'as pas encore créé ces fichiers, commente ces deux lignes pour éviter l'erreur
import AdminUsers from "../components/AdminUsers";
import AdminPacks from "../components/AdminPacks";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- RECUPERATION REDUX ---
  const { user } = useSelector((state) => state.auth);
  // On utilise || [] pour garantir que ce sont toujours des tableaux, même si l'API renvoie null au début
  const { books = [] } = useSelector((state) => state.books); 
  const { orders = [], stats = [] } = useSelector((state) => state.order);
  const { categories = [] } = useSelector((state) => state.category);

  // --- ETATS LOCAUX ---
  const [activeTab, setActiveTab] = useState('stats');

  // États Catégories
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryAr, setNewCategoryAr] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [isEditingCat, setIsEditingCat] = useState(false);
  const [editCatId, setEditCatId] = useState(null);

  // États Livre
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author: '', price: '', buyPrice: '', category: '', stock: '', 
    coverImage: '', image2: '', image3: ''
  });

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      // On charge tout au démarrage
      dispatch(getBooks());
      dispatch(getAllOrders());
      dispatch(getCategories());
      dispatch(getOrderStats());
    }
  }, [user, navigate, dispatch]);

  // --- OPTIMISATION : CALCUL DES DONNÉES (useMemo) ---
  // On utilise useMemo pour ne pas recalculer ça à chaque clic sur un bouton (Performance)
  
  const chartData = useMemo(() => {
    if (!Array.isArray(stats)) return [];
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    return stats.map(item => {
      const monthIndex = (item._id && item._id.month) ? item._id.month - 1 : 0;
      return {
        name: months[monthIndex] || "Inconnu",
        Ventes: item.totalSales || 0,
        Bénéfice: item.totalProfit || 0
      };
    });
  }, [stats]);

  const { totalRevenue, totalProfit, totalOrdersCount } = useMemo(() => {
    if (!Array.isArray(stats)) return { totalRevenue: 0, totalProfit: 0, totalOrdersCount: 0 };
    return {
      totalRevenue: stats.reduce((acc, item) => acc + (item.totalSales || 0), 0),
      totalProfit: stats.reduce((acc, item) => acc + (item.totalProfit || 0), 0),
      totalOrdersCount: stats.reduce((acc, i) => acc + (i.count || 0), 0)
    };
  }, [stats]);

  const soldBooks = useMemo(() => {
    if (!orders) return [];
    return orders.reduce((acc, order) => {
      // On vérifie que la commande est payée ou livrée pour compter la vente (optionnel, ici on compte tout)
      order.orderItems.forEach(item => {
          const existingItem = acc.find(i => i.title === item.title);
          if (existingItem) {
              existingItem.qty += item.qty;
              existingItem.totalRevenue += item.qty * item.price;
          } else {
              acc.push({ 
                  title: item.title, 
                  qty: item.qty, 
                  totalRevenue: item.qty * item.price 
              });
          }
      });
      return acc;
    }, []).sort((a, b) => b.qty - a.qty); // Tri par quantité vendue
  }, [orders]);

  const pendingOrdersCount = orders ? orders.filter(o => !o.isDelivered).length : 0;

  // --- HANDLERS (LIVRES) ---
  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateBook({ id: editId, bookData: formData }));
      toast.success('Livre mis à jour !');
      setIsEditing(false);
      setEditId(null);
    } else {
      dispatch(createBook(formData));
      toast.success('Livre ajouté !');
    }
    setFormData({ title: '', author: '', price: '', buyPrice: '', category: '', stock: '', coverImage: '', image2: '', image3: '' });
  };
  
  const handleEditClick = (book) => {
    setIsEditing(true);
    setEditId(book._id);
    setFormData({
      title: book.title, author: book.author, price: book.price, buyPrice: book.buyPrice || 0,
      category: book.category, stock: book.stock, coverImage: book.coverImage,
      image2: book.image2 || '', image3: book.image3 || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ title: '', author: '', price: '', buyPrice: '', category: '', stock: '', coverImage: '', image2: '', image3: '' });
  };

  const handleDeleteBook = (id) => { if (window.confirm('Supprimer ce livre ?')) dispatch(deleteBook(id)); };
  
  const toggleFeatured = (book) => {
    const updatedBook = { ...book, isFeatured: !book.isFeatured };
    dispatch(updateBook({ id: book._id, bookData: updatedBook }));
    if (!book.isFeatured) toast.success('Ajouté à la sélection !');
    else toast.info('Retiré de la sélection');
  };

  // --- HANDLERS (CATEGORIES) ---
  const handleCategorySubmit = (e) => { 
      e.preventDefault(); 
      if (newCategory.trim()) { 
          const catData = { 
            name: newCategory, 
            nameAr: newCategoryAr, // Envoi du champ Arabe
            image: newCatImage 
          };

          if (isEditingCat) {
              dispatch(updateCategory({ id: editCatId, categoryData: catData }));
              toast.success('Catégorie mise à jour !');
              setIsEditingCat(false);
              setEditCatId(null);
          } else {
              dispatch(createCategory(catData)); 
              toast.success('Catégorie ajoutée'); 
          }
          setNewCategory(''); 
          setNewCategoryAr(''); 
          setNewCatImage(''); 
      }
  };

  const handleEditCategoryClick = (cat) => {
      setIsEditingCat(true);
      setEditCatId(cat._id);
      setNewCategory(cat.name);
      setNewCategoryAr(cat.nameAr || '');
      setNewCatImage(cat.image || '');
  };

  const handleCancelCatEdit = () => {
      setIsEditingCat(false);
      setEditCatId(null);
      setNewCategory('');
      setNewCategoryAr('');
      setNewCatImage('');
  };
  
  const handleDeleteCategory = (id) => { if (window.confirm('Supprimer cette catégorie ?')) dispatch(deleteCategory(id)); };

  // --- HANDLERS (COMMANDES) ---
  const handleConfirm = (id) => { if (window.confirm('Confirmer la commande ?')) dispatch(markAsConfirmed(id)); };
  const handleDeliver = (id) => { if (window.confirm('Marquer comme livré ?')) dispatch(markAsDelivered(id)); };
  
  const handleDeleteOrder = (id) => {
    if (window.confirm('ATTENTION : Voulez-vous vraiment supprimer cette commande définitivement ?')) {
        dispatch(deleteOrder(id));
        toast.error('Commande supprimée');
    }
  };

  const handleNoteUpdate = (id, noteValue) => {
    dispatch(updateNote({ id, note: noteValue }));
  };

  // --- NAVIGATION TAB HELPER ---
  // Petite fonction pour rendre le code du menu plus propre
  const TabButton = ({ id, label, icon: Icon, alertCount }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`relative flex items-center gap-2 px-5 py-3 rounded-lg font-bold transition whitespace-nowrap
        ${activeTab === id ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
    >
      <Icon size={18} /> {label}
      {alertCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse shadow-sm">
          {alertCount}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Tableau de Bord Admin</h1>

        {/* --- BARRE DE NAVIGATION (Scrollable sur mobile) --- */}
        <div className="flex overflow-x-auto pb-4 gap-3 mb-6 no-scrollbar">
          <TabButton id="stats" label="Statistiques" icon={BarChart3} />
          <TabButton id="orders" label="Commandes" icon={Package} alertCount={pendingOrdersCount} />
          <TabButton id="sales" label="Ventes" icon={ShoppingBag} />
          <TabButton id="books" label="Livres" icon={Book} />
          <TabButton id="categories" label="Catégories" icon={Tags} />
          
          {/* NOUVEAUX ONGLETS POUR LES MODULES */}
          <div className="w-px bg-gray-300 mx-2"></div> {/* Séparateur visuel */}
          <TabButton id="users" label="Utilisateurs" icon={Users} />
          <TabButton id="packs" label="Packs Promo" icon={Gift} />
        </div>

        {/* ==================== CONTENU DES ONGLETS ==================== */}

        {/* 1. STATISTIQUES */}
        {activeTab === 'stats' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                    <div className="flex items-center gap-2 text-gray-500 mb-1"><Banknote size={20}/> Chiffre d'Affaires</div>
                    <div className="text-3xl font-bold text-blue-900">{totalRevenue.toLocaleString()} DA</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                    <div className="flex items-center gap-2 text-gray-500 mb-1"><Wallet size={20}/> Bénéfice Net</div>
                    <div className="text-3xl font-bold text-green-600">{totalProfit.toLocaleString()} DA</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                    <div className="flex items-center gap-2 text-gray-500 mb-1"><Package size={20}/> Commandes Totales</div>
                    <div className="text-3xl font-bold text-gray-800">{totalOrdersCount}</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm h-96 w-full">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><TrendingUp /> Performances Financières</h2>
                {chartData.length > 0 ? (
                    <div style={{ width: '100%', height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Ventes" fill="#1e3a8a" name="Ventes (CA)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Bénéfice" fill="#16a34a" name="Bénéfice Net" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : <div className="h-full flex items-center justify-center text-gray-400">Aucune donnée confirmée pour le moment.</div>}
            </div>
          </div>
        )}

        {/* 2. VENTES */}
        {activeTab === 'sales' && (
          <div className="bg-white p-6 rounded-xl shadow-sm animate-fade-in">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ShoppingBag className="text-blue-600"/> Palmarès des Ventes
            </h2>
            {soldBooks.length === 0 ? (
                <p className="text-gray-500 italic text-center py-10">Aucun livre vendu pour le moment.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-gray-600 text-sm uppercase">
                                <th className="p-4">Rang</th>
                                <th className="p-4">Titre du Livre</th>
                                <th className="p-4 text-center">Quantité</th>
                                <th className="p-4 text-right">C.A. Généré</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {soldBooks.map((item, index) => (
                                <tr key={index} className="hover:bg-blue-50 transition">
                                    <td className="p-4">
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-400 text-white shadow' : index === 1 ? 'bg-gray-300 text-gray-600' : index === 2 ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{item.title}</td>
                                    <td className="p-4 text-center">
                                        <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-bold text-sm">
                                            {item.qty}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-green-600">
                                        {item.totalRevenue.toLocaleString()} DA
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
        )}

        {/* 3. LIVRES (Gestion) */}
        {activeTab === 'books' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Formulaire Livre */}
            <div className={`p-6 rounded-xl shadow-sm h-fit transition-all duration-300 ${isEditing ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-xl font-bold ${isEditing ? 'text-yellow-700' : 'text-gray-800'}`}>
                    {isEditing ? 'Modifier le livre' : 'Ajouter un livre'}
                  </h2>
                  {isEditing && <button onClick={handleCancelEdit} className="text-gray-500 hover:text-red-500"><X size={24}/></button>}
              </div>
              <form onSubmit={handleBookSubmit} className="space-y-3">
                <input type="text" placeholder="Titre *" value={formData.title} onChange={(e)=>setFormData({...formData, title:e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                <input type="text" placeholder="Auteur *" value={formData.author} onChange={(e)=>setFormData({...formData, author:e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500">Prix Vente *</label>
                        <input type="number" placeholder="ex: 2500" value={formData.price} onChange={(e)=>setFormData({...formData, price:e.target.value})} className="w-full border p-2 rounded font-bold text-blue-900" required />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500">Prix Achat (Coût)</label>
                        <input type="number" placeholder="ex: 1500" value={formData.buyPrice} onChange={(e)=>setFormData({...formData, buyPrice:e.target.value})} className="w-full border p-2 rounded bg-gray-50" />
                    </div>
                </div>
                {categories.length > 0 ? (
                    <select value={formData.category} onChange={(e)=>setFormData({...formData, category:e.target.value})} className="w-full border p-2 rounded bg-white" required>
                        <option value="">Choisir une catégorie...</option>
                        {categories.map((cat) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                    </select>
                ) : (
                    <input type="text" placeholder="Catégorie (ex: Coding)" value={formData.category} onChange={(e)=>setFormData({...formData, category:e.target.value})} className="w-full border p-2 rounded" required />
                )}
                <input type="number" placeholder="Stock *" value={formData.stock} onChange={(e)=>setFormData({...formData, stock:e.target.value})} className="w-full border p-2 rounded font-bold" required />
                
                <div className="space-y-2 border-t pt-2 mt-2">
                    <p className="text-sm font-bold text-gray-600">Images (Liens URL)</p>
                    <input type="text" placeholder="Image Couverture *" value={formData.coverImage} onChange={(e)=>setFormData({...formData, coverImage:e.target.value})} className="w-full border p-2 rounded text-sm" required />
                    <input type="text" placeholder="Image Extra 2 (Optionnel)" value={formData.image2} onChange={(e)=>setFormData({...formData, image2:e.target.value})} className="w-full border p-2 rounded text-sm" />
                    <input type="text" placeholder="Image Extra 3 (Optionnel)" value={formData.image3} onChange={(e)=>setFormData({...formData, image3:e.target.value})} className="w-full border p-2 rounded text-sm" />
                </div>
                <button type="submit" className={`w-full py-2 rounded font-bold mt-4 flex justify-center items-center gap-2 text-white transition shadow-sm ${isEditing ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-900 hover:bg-blue-800'}`}>
                    {isEditing ? <Pencil size={20} /> : <Plus size={20} />} 
                    {isEditing ? 'Mettre à jour' : 'Ajouter le livre'}
                </button>
              </form>
            </div>

            {/* Liste Livre */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold">Stock ({books.length} livres)</h2>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-gray-500 text-sm bg-gray-50">
                    <th className="p-3 rounded-tl-lg">Titre</th>
                    <th className="p-3">Prix</th>
                    <th className="p-3">Marge</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-center">Vedette</th> 
                    <th className="p-3 rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3 font-medium text-gray-800 max-w-[200px] truncate" title={book.title}>{book.title}</td>
                      <td className="p-3 whitespace-nowrap">{book.price} DA</td>
                      <td className="p-3 font-bold text-green-600 whitespace-nowrap">
                        {book.price - (book.buyPrice || 0)} DA
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${book.stock > 10 ? 'bg-green-100 text-green-700' : book.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {book.stock}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => toggleFeatured(book)} className="transition transform hover:scale-110 active:scale-90">
                            <Star size={20} className={book.isFeatured ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"} />
                        </button>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => handleEditClick(book)} className="bg-yellow-100 text-yellow-700 p-2 rounded hover:bg-yellow-200 transition"><Pencil size={18} /></button>
                        <button onClick={() => handleDeleteBook(book._id)} className="bg-red-100 text-red-500 p-2 rounded hover:bg-red-200 transition"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. COMMANDES */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
             {orders.length === 0 ? (
                <div className="p-10 text-center text-gray-500">Aucune commande pour le moment.</div>
             ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr className="text-gray-600 text-sm uppercase tracking-wider">
                        <th className="p-4">Client</th>
                        <th className="p-4">Panier</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Statut</th>
                        <th className="p-4">Note (Interne)</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-blue-50 transition group">
                          <td className="p-4 align-top">
                            <div className="font-bold text-gray-900">{order.shippingAddress.fullName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1"><PhoneCall size={14}/> {order.shippingAddress.phone}</div>
                            <div className="text-xs text-gray-400">{order.shippingAddress.city}</div>
                          </td>
                          <td className="p-4 align-top">
                            <ul className="text-sm space-y-1">
                              {order.orderItems.map((item, i) => (
                                <li key={i}><span className="font-bold">{item.qty}x</span> {item.title}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-4 align-top font-bold text-blue-900 whitespace-nowrap">{order.totalPrice} DA</td>
                          <td className="p-4 align-top">
                            {order.isDelivered ? <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200"><CheckCircle size={14} /> LIVRÉ</span> 
                            : order.isConfirmed ? <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200"><CheckCircle size={14} /> CONFIRMÉ</span> 
                            : <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200"><Clock size={14} /> EN ATTENTE</span>}
                          </td>
                          <td className="p-4 align-top">
                             <div className="relative">
                                <StickyNote size={16} className="absolute top-2 left-2 text-gray-400" />
                                <textarea 
                                    defaultValue={order.note || ''} 
                                    onBlur={(e) => handleNoteUpdate(order._id, e.target.value)}
                                    placeholder="Ajouter une note..."
                                    rows="2"
                                    className="pl-8 w-full min-w-[150px] border border-gray-200 rounded p-1 text-sm bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none resize-none transition"
                                />
                             </div>
                          </td>
                          <td className="p-4 align-top">
                             <div className="flex flex-col gap-2">
                                {!order.isDelivered && (
                                  <>
                                    {!order.isConfirmed && <button onClick={() => handleConfirm(order._id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-bold shadow-sm transition">Confirmer</button>}
                                    {order.isConfirmed && <button onClick={() => handleDeliver(order._id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-bold shadow-sm flex items-center justify-center gap-1 transition"><Truck size={14} /> Livrer</button>}
                                  </>
                                )}
                                <button 
                                    onClick={() => handleDeleteOrder(order._id)} 
                                    className="mt-1 text-red-400 hover:text-red-600 text-xs font-bold flex items-center gap-1 justify-center hover:bg-red-50 p-1 rounded transition"
                                >
                                    <Trash2 size={14} /> Supprimer
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             )}
          </div>
        )}

        {/* 5. CATÉGORIES */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            <div className={`p-6 rounded-xl shadow-sm h-fit transition-all ${isEditingCat ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-xl font-bold flex items-center gap-2 ${isEditingCat ? 'text-yellow-700' : ''}`}>
                        <Tags size={20}/> {isEditingCat ? 'Modifier la catégorie' : 'Nouvelle Catégorie'}
                    </h2>
                    {isEditingCat && (
                        <button onClick={handleCancelCatEdit} className="text-gray-500 hover:text-red-500"><X size={24}/></button>
                    )}
                </div>
                
                <form onSubmit={handleCategorySubmit} className="flex flex-col gap-3">
                    {/* CHAMP FRANÇAIS */}
                    <div>
                        <label className="text-xs text-gray-500 font-bold ml-1">Nom (Français)</label>
                        <input type="text" placeholder="Ex: Coding" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>

                    {/* CHAMP ARABE */}
                    <div>
                        <label className="text-xs text-gray-500 font-bold ml-1 flex items-center gap-1"><Globe size={12}/> Nom (Arabe)</label>
                        <input type="text" placeholder="مثال: برمجة" value={newCategoryAr} onChange={(e) => setNewCategoryAr(e.target.value)} className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none text-right" dir="rtl" required />
                    </div>

                    {/* CHAMP IMAGE */}
                    <div>
                        <label className="text-xs text-gray-500 font-bold ml-1">Image URL</label>
                        <input type="text" placeholder="https://..." value={newCatImage} onChange={(e) => setNewCatImage(e.target.value)} className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <button type="submit" className={`px-4 py-2 rounded font-bold transition flex items-center justify-center gap-2 text-white mt-2 ${isEditingCat ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-900 hover:bg-blue-800'}`}>
                        {isEditingCat ? <Pencil size={18} /> : <Plus size={18} />} 
                        {isEditingCat ? 'Mettre à jour' : 'Ajouter'}
                    </button>
                </form>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><List size={20}/> Liste des catégories</h2>
                {categories.length === 0 ? <p className="text-gray-500 italic text-center py-4">Aucune catégorie créée.</p> : (
                    <ul className="space-y-2 max-h-[500px] overflow-y-auto">
                        {categories.map((cat) => (
                            <li key={cat._id} className="flex justify-between items-center bg-gray-50 p-3 rounded border hover:bg-blue-50 transition group">
                                <div className="flex items-center gap-3">
                                    {(cat.image && cat.image.startsWith('http')) ? (
                                        <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" onError={(e) => {e.target.style.display = 'none'}} />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><ImageIcon size={18} /></div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800">{cat.name}</span>
                                        <span className="text-xs text-gray-500 font-arabic">{cat.nameAr || '---'}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                     <button onClick={() => handleEditCategoryClick(cat)} className="text-yellow-500 hover:text-yellow-700 p-2 rounded-full hover:bg-yellow-50 transition"><Pencil size={18} /></button>
                                     <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"><Trash2 size={18} /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
          </div>
        )}

        {/* 6. UTILISATEURS (Module Externe) */}
        {activeTab === 'users' && (
           <div className="animate-fade-in">
             <AdminUsers />
           </div>
        )}

        {/* 7. PACKS PROMO (Module Externe) */}
        {activeTab === 'packs' && (
           <div className="animate-fade-in">
             <AdminPacks />
           </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;