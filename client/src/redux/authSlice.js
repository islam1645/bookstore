import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Récupérer l'utilisateur du stockage local
const user = JSON.parse(localStorage.getItem('userInfo'));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Détection URL (Local ou Prod)
const getApiUrl = () => {
  return window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/users' 
    : 'https://bookstore-d1k4.onrender.com/api/users';
};

// --- REGISTER (INSCRIPTION) ---
// Note : On ne sauvegarde PAS le user ici car il doit valider l'OTP d'abord
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    const API_URL = getApiUrl();
    const response = await axios.post(API_URL, user);
    // ON NE FAIT PAS localStorage.setItem ICI !
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// --- SET CREDENTIALS (CONNEXION MANUELLE APRÈS OTP) ---
// Cette action sert à connecter l'utilisateur une fois qu'on a le token
export const setCredentials = createAsyncThunk('auth/setCredentials', async (userData, thunkAPI) => {
    // On sauvegarde dans le localStorage car c'est une vraie connexion
    localStorage.setItem('userInfo', JSON.stringify(userData));
    return userData;
});

// --- LOGIN (CONNEXION CLASSIQUE) ---
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    const API_URL = getApiUrl() + '/login';
    const response = await axios.post(API_URL, user);

    if (response.data) {
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// --- LOGOUT ---
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('userInfo');
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
      // --- REGISTER CASES ---
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // IMPORTANT : On NE connecte PAS l'utilisateur ici (state.user reste null)
        state.message = action.payload.message; 
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })

      // --- LOGIN CASES ---
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // Ici on connecte
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })

      // --- SET CREDENTIALS CASES (OTP) ---
      .addCase(setCredentials.fulfilled, (state, action) => {
          state.user = action.payload;
          state.isSuccess = true;
      })

      // --- LOGOUT CASE ---
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;