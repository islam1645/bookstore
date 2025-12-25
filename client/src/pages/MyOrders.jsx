import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';

const MyOrders = () => {
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await axios.get('/api/orders/myorders', config);
        setOrders(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes");
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    if (status === 'Livré') return <CheckCircle className="text-green-500" size={18} />;
    if (status === 'En cours') return <Truck className="text-blue-500" size={18} />;
    return <Clock className="text-yellow-500" size={18} />;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Package className="text-blue-600" />
        {t('orders.title')}
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl text-center shadow-sm border border-gray-100">
          <p className="text-gray-500">{t('orders.no_orders')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className={isArabic ? 'text-right' : 'text-left'}>
                <p className="text-sm text-gray-500">{t('orders.order_id')} {order._id.slice(-6)}</p>
                <p className="font-bold text-lg text-gray-800">{order.totalPrice} DA</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${order.isPaid ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}>
                {getStatusIcon(order.status)}
                <span className="text-sm font-medium">
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