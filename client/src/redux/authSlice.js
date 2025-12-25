import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Récupérer l'utilisateur du stockage local s'il existe
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  // On initialise isAdmin en vérifiant le localStorage au chargement
  isAdmin: user ? user.isAdmin : false, 
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Fonction asynchrone pour le Login
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    return await authService.login(userData);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || 
                    error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Fonction pour le Logout
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
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        // MISE À JOUR IMPORTANTE : On récupère le rôle Admin depuis le payload
        state.isAdmin = action.payload.isAdmin || false; 
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.isAdmin = false; // Reset en cas d'échec
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAdmin = false; // Reset lors du logout
        state.isSuccess = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;