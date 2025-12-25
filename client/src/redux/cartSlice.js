import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // On récupère le panier du stockage local s'il existe, sinon tableau vide
  cartItems: localStorage.getItem('cartItems') 
    ? JSON.parse(localStorage.getItem('cartItems')) 
    : [],
  
  // On récupère l'adresse de livraison si elle existe déjà
  shippingAddress: localStorage.getItem('shippingAddress') 
    ? JSON.parse(localStorage.getItem('shippingAddress')) 
    : {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. AJOUTER AU PANIER
    addToCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex((item) => item._id === action.payload._id);

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].qty += 1;
      } else {
        const tempProduct = { ...action.payload, qty: 1 };
        state.cartItems.push(tempProduct);
      }
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    // 2. DIMINUER LA QUANTITÉ
    decreaseCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex((item) => item._id === action.payload._id);

      if (state.cartItems[itemIndex].qty > 1) {
        state.cartItems[itemIndex].qty -= 1;
      } else if (state.cartItems[itemIndex].qty === 1) {
        state.cartItems = state.cartItems.filter((item) => item._id !== action.payload._id);
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    // 3. SUPPRIMER UN ARTICLE
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item._id !== action.payload._id);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    // 4. SAUVEGARDER L'ADRESSE
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },

    // 5. VIDER LE PANIER (J'ai renommé clearCart en resetCart pour correspondre à Cart.jsx)
    resetCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const { 
  addToCart, 
  decreaseCart, 
  removeFromCart, 
  saveShippingAddress, 
  resetCart // <--- Important : le nom doit être resetCart
} = cartSlice.actions;

export default cartSlice.reducer;