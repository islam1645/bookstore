import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/authSlice';
import { ShoppingCart, LogOut, LayoutDashboard, BookOpen, User, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // On récupère 'user' depuis le state Auth
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-blue-900 flex items-center gap-2 hover:opacity-80 transition">
            <BookOpen className="text-blue-600" size={28} />
            <span>KutubDZ<span className="text-blue-500">.</span></span>
          </Link>

          {/* MENU CENTRAL (Desktop) */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">{t('navbar.home')}</Link>
            <Link to="/shop" className="text-gray-600 hover:text-blue-600 font-medium transition">{t('navbar.shop')}</Link>
            <Link to="/categories" className="text-gray-600 hover:text-blue-600 font-medium transition">{t('navbar.categories')}</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition">{t('navbar.about')}</Link>
          </div>

          {/* ICONS & AUTH */}
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            
            <LanguageSwitcher />

            {/* PANIER */}
            <Link to="/cart" className="relative group text-gray-600 hover:text-blue-600 transition">
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* ZONE UTILISATEUR CONNECTÉ */}
            {user ? (
              <div className="flex items-center gap-4 border-l pl-6 border-gray-200 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">
                
                {/* 1. DASHBOARD ADMIN (Seulement si admin) */}
                {user.isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="text-sm font-medium text-blue-700 hover:text-blue-900 flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg transition"
                  >
                    <LayoutDashboard size={18} /> 
                    <span className="hidden lg:inline">{t('navbar.dashboard')}</span>
                  </Link>
                )}

                {/* 2. MENU CLIENT (Mes Commandes & Profil) */}
                {!user.isAdmin && (
                  <>
                    <Link 
                      to="/my-orders" 
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1 transition"
                      title={t('orders.title')}
                    >
                      <Package size={20} className="text-blue-500" />
                      <span className="hidden lg:inline">{t('orders.title')}</span>
                    </Link>

                    {/* LIEN VERS PROFIL (Nouveau) */}
                    <Link 
                      to="/profile" 
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1 transition"
                      title="Mon Profil"
                    >
                      <User size={20} className="text-gray-500" />
                      {/* On affiche le nom de l'utilisateur comme lien vers le profil */}
                      <span className="font-bold hidden sm:inline text-blue-900">
                        {user.name.split(' ')[0]} {/* Affiche juste le prénom */}
                      </span>
                    </Link>
                  </>
                )}
                
                {/* 3. BOUTON DÉCONNEXION */}
                <button 
                  onClick={onLogout} 
                  className="text-red-500 hover:text-red-700 transition ml-2"
                  title={t('navbar.logout')}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              // ZONE VISITEUR (Login)
              <Link to="/user-login" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1">
                  <User size={24} />
                  <span className="hidden sm:inline">{t('navbar.login')}</span>
              </Link>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;