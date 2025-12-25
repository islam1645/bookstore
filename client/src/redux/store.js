import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookReducer from './bookSlice'; // Import du nouveau reducer
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import categoryReducer from './categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer, // Ajout ici
    cart: cartReducer,
    order: orderReducer,    
    category: categoryReducer,
  },
});