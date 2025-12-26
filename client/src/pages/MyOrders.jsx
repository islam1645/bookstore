import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { listMyOrders } from '../redux/orderSlice'; // Import de l'action
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === 'ar';

  // On récupère les commandes depuis le store Redux
  const { orders, isLoading, isError, message } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(listMyOrders()); // On lance la récupération des commandes
    }
  }, [dispatch, user]);

  const getStatusIcon = (status) => {
    if (status === 'Livré' || status === 'Delivered') return <CheckCircle className="text-green-500" size={18} />;
    if (status === 'En cours' || status === 'Shipped') return <Truck className="text-blue-500" size={18} />;
    return <Clock className="text-yellow-500" size={18} />;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Package className="text-blue-600" />
        {t('orders.title')} {/* "Mes Commandes" ou "طلباتي" */}
      </h1>

      {isLoading ? (
        <p className="text-center text-gray-500">Chargement des commandes...</p>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
           <AlertCircle /> {message}
        </div>
      ) : orders?.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl text-center shadow-sm border border-gray-100">
          <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-4">{t('orders.no_orders')}</p>
          <Link to="/shop" className="text-blue-600 font-bold hover:underline">
            Commencer vos achats
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition">
              <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center gap-2 mb-1">
                   <span className="font-bold text-gray-900 text-lg">
                     {order.totalPrice} DA
                   </span>
                   <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                     {order.paymentMethod}
                   </span>
                </div>
                <p className="text-sm text-gray-500">
                  {t('orders.order_id')} <span className="font-mono text-gray-700">#{order._id.slice(-6)}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()} à {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>

              {/* Statut de la commande */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                order.isDelivered ? 'bg-green-50 border-green-100 text-green-700' : 'bg-yellow-50 border-yellow-100 text-yellow-700'
              }`}>
                {getStatusIcon(order.isDelivered ? 'Livré' : 'En attente')}
                <span className="text-sm font-bold">
                  {order.isDelivered ? t('orders.status_delivered') : t('orders.status_pending')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;