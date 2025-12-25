import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://bookstore-d1k4.onrender.com/api/categories/';

// Récupérer le token pour l'admin
const getToken = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user?.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

// --- ACTIONS ---

export const createCategory = createAsyncThunk('categories/create', async (categoryData, thunkAPI) => {
  try {
    const config = getToken(thunkAPI);
    const response = await axios.post(API_URL, categoryData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const getCategories = createAsyncThunk('categories/getAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id, thunkAPI) => {
  try {
    const config = getToken(thunkAPI);
    await axios.delete(API_URL + id, config);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// --- NOUVELLE ACTION : MISE À JOUR ---
export const updateCategory = createAsyncThunk('categories/update', async ({ id, categoryData }, thunkAPI) => {
  try {
    const config = getToken(thunkAPI);
    // On appelle l'URL avec l'ID (ex: /api/categories/123) avec les nouvelles données
    const response = await axios.put(`${API_URL}${id}`, categoryData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// --- SLICE ---

const categorySlice = createSlice({
  name: 'category',
  initialState: { categories: [], isLoading: false, isError: false, message: '' },
  reducers: {
    resetCategory: (state) => { state.isError = false; state.message = ''; },
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getCategories.fulfilled, (state, action) => { state.categories = action.payload; })
      
      // Create
      .addCase(createCategory.fulfilled, (state, action) => { state.categories.push(action.payload); })
      
      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload);
      })

      // Update (NOUVEAU)
      .addCase(updateCategory.fulfilled, (state, action) => {
        // On cherche l'index de la catégorie modifiée dans le tableau
        const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) {
          // On remplace l'ancienne catégorie par la nouvelle (mise à jour)
          state.categories[index] = action.payload;
        }
      });
  },
});

export const { resetCategory } = categorySlice.actions;
export default categorySlice.reducer;