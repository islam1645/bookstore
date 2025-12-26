import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Détection URL
const getApiUrl = () => {
  return window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/settings' 
    : 'https://bookstore-d1k4.onrender.com/api/settings';
};

// 1. Récupérer les réglages
export const getSettings = createAsyncThunk('settings/get', async (_, thunkAPI) => {
  try {
    const response = await axios.get(getApiUrl());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 2. Mettre à jour (Admin)
export const updateSettings = createAsyncThunk('settings/update', async (settingsData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const response = await axios.put(getApiUrl(), settingsData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const settingSlice = createSlice({
  name: 'settings',
  initialState: {
    settings: {}, // Objet vide au départ
    isLoading: false,
    isError: false,
    isSuccess: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => { state.isLoading = true; })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.settings = action.payload;
      });
  },
});

export default settingSlice.reducer;