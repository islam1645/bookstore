import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/authSlice';
import { ShoppingCart, LogOut, LayoutDashboard, BookOpen } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. On récupère les infos (User + Panier)
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  // 2. Fonction de déconnexion
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* --- PARTIE GAUCHE : LOGO --- */}
          <Link to="/" className="text-2xl font-bold text-blue-900 flex items-center gap-2 hover:opacity-80 transition">
            <BookOpen className="text-blue-600" size={28} />
            <span>BookStore<span className="text-blue-500">.</span></span>
          </Link>

          {/* --- PARTIE CENTRALE : MENU PRINCIPAL --- */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Accueil
            </Link>
            <Link to="/shop" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Boutique
            </Link>
            <Link to="/categories" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Catégories
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition">
              À Propos
            </Link>
          </div>

          {/* --- PARTIE DROITE : ICONS --- */}
          <div className="flex items-center space-x-6">
            
            {/* 1. Panier (Toujours visible) */}
            <Link to="/cart" className="relative group text-gray-600 hover:text-blue-600 transition">
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* 2. Zone Admin (VISIBLE UNIQUEMENT SI CONNECTÉ) */}
            {user && (
              <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                <Link 
                  to="/admin/dashboard" 
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-2"
                >
                  <LayoutDashboard size={18} /> 
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
                
                <button 
                  onClick={onLogout} 
                  className="text-red-500 hover:text-red-700 transition"
                  title="Déconnexion"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
            
            {/* Si pas connecté, il n'y a rien ici. Le bouton Login est caché. */}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;