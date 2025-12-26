import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Change l'URL selon ton environnement (local ou prod)
// Si tu as un proxy dans vite.config.js, garde juste '/api/categories/'
const API_URL = 'http://localhost:5000/api/categories/'; 

// 1. Récupérer les catégories
export const getCategories = createAsyncThunk('categories/getAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 2. Créer une catégorie
export const createCategory = createAsyncThunk('categories/create', async (categoryData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const response = await axios.post(API_URL, categoryData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 3. Supprimer une catégorie
export const deleteCategory = createAsyncThunk('categories/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    await axios.delete(API_URL + id, config);
    return id; // On retourne l'ID pour le supprimer du state local
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 4. Mettre à jour une catégorie (C'EST ICI QUE C'EST IMPORTANT)
export const updateCategory = createAsyncThunk('categories/update', async ({ id, categoryData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // On envoie la requête PUT
    const response = await axios.put(API_URL + id, categoryData, config);
    return response.data; // Le backend renvoie la catégorie mise à jour
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
  },
  reducers: {
    resetCategoryState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getCategories.pending, (state) => { state.isLoading = true; })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // CREATE
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories.push(action.payload); // Ajoute la nouvelle catégorie à la liste
      })

      // DELETE
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Filtre la liste pour enlever celle supprimée
        state.categories = state.categories.filter((cat) => cat._id !== action.payload);
      })

      // UPDATE (La partie manquante souvent)
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // On cherche l'index de la catégorie modifiée dans le tableau
        const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) {
            // On remplace l'ancienne version par la nouvelle (qui contient le nom Arabe)
            state.categories[index] = action.payload;
        }
      });
  },
});

export const { resetCategoryState } = categorySlice.actions;
export default categorySlice.reducer;