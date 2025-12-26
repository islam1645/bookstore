import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://bookstore-d1k4.onrender.com/api/orders/';

// Fonction utilitaire pour récupérer le token
const getToken = (thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.user?.token;
  
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// --- ACTIONS (THUNKS) ---

// 1. Créer une commande
export const createOrder = createAsyncThunk('orders/create', async (orderData, thunkAPI) => {
  try {
    const config = getToken(thunkAPI); 
    const response = await axios.post(API_URL, orderData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 2. Récupérer toutes les commandes (Admin)
export const getAllOrders = createAsyncThunk('orders/getAll', async (_, thunkAPI) => {
  try {
    const config = getToken(thunkAPI);
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// --- AJOUT IMPORTANT : Récupérer MES commandes (Client) ---
export const listMyOrders = createAsyncThunk('orders/listMyOrders', async (_, thunkAPI) => {
  try {
    const config = getToken(thunkAPI);
    // On appelle l'URL : /api/orders/myorders
    const response = await axios.get(API_URL + 'myorders', config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});
// ---------------------------------------------------------

// 3. Confirmer une commande
export const markAsConfirmed = createAsyncThunk('orders/confirm', async (id, thunkAPI) => {
  try {
    const config = getToken(thunkAPI);
    const response = await axios.put(`${API_URL}${id}/confirm`, {}, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 4. Livrer une commande
export const markAsDelivered = createAsyncThunk('orders/deliver', async (id, thunkAPI) => {
  try {
    const config = getToken(thunkAPI);
    const response = await axios.put(`${API_URL}${id}/deliver`, {}, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 5. Mettre à jour la NOTE
export const updateNote = createAsyncThunk('orders/updateNote', async ({ id, note }, thunkAPI) => {
  try {
    const config = getToken(thunkAPI);
    const response = await axios.put(`${API_URL}${id}/note`, { note }, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 6. Supprimer une commande
export const deleteOrder = createAsyncThunk('orders/delete', async (id, thunkAPI) => {
  try {
    const config = getToken(thunkAPI);
    await axios.delete(`${API_URL}${id}`, config);
    return id; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 7. Récupérer les STATISTIQUES
export const getOrderStats = createAsyncThunk('orders/stats', async (_, thunkAPI) => {
  try {
    const config = getToken(thunkAPI);
    const response = await axios.get(`${API_URL}stats`, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// --- SLICE ---

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    stats: {}, 
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
  },
  reducers: {
    resetOrder: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createOrder.pending, (state) => { state.isLoading = true; })
      .addCase(createOrder.fulfilled, (state) => { 
          state.isLoading = false;
          state.isSuccess = true; 
      })
      .addCase(createOrder.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
      })
      
      // Get All (Admin)
      .addCase(getAllOrders.pending, (state) => { state.isLoading = true; })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // --- AJOUT : Get MY Orders (Client) ---
      .addCase(listMyOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(listMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload; // On met à jour la liste avec MES commandes
      })
      .addCase(listMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // -------------------------------------

      // Stats
      .addCase(getOrderStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // Update : Confirmé
      .addCase(markAsConfirmed.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = action.payload;
      })

      // Update : Livré
      .addCase(markAsDelivered.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = action.payload;
      })

      // Update : Note
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = action.payload; 
      })

      // Delete
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order._id !== action.payload);
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;