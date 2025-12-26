import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookReducer from './bookSlice'; 
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import categoryReducer from './categorySlice';
import settingReducer from './settingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer, 
    cart: cartReducer,
    order: orderReducer,    
    category: categoryReducer,
    settings: settingReducer,
    order: orderReducer,
  },
});