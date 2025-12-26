import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Récupérer l'utilisateur du stockage local s'il existe
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isAdmin: user ? user.isAdmin : false, 
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// 1. Fonction asynchrone pour l'Inscription (AJOUTÉE)
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || 
                    error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// 2. Fonction asynchrone pour le Login
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    return await authService.login(userData);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || 
                    error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// 3. Fonction pour le Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Gestion du Login ---
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isAdmin = action.payload.isAdmin || false; 
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.isAdmin = false;
      })
      
      // --- Gestion du Register (AJOUTÉE) ---
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        // Un nouvel inscrit n'est généralement pas admin par défaut
        state.isAdmin = false; 
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })

      // --- Gestion du Logout ---
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAdmin = false;
        state.isSuccess = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;