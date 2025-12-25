import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookService from './bookService';
import axios from 'axios';

const API_URL = 'https://bookstore-d1k4.onrender.com/api/books/';

const initialState = {
  books: [],
  featuredBooks: [], // <--- NOUVEAU : Pour stocker la sélection du carrousel
  book: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// --- Les Actions Asynchrones ---

// Créer un livre
export const createBook = createAsyncThunk('books/create', async (bookData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await bookService.createBook(bookData, token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Récupérer TOUS les livres
export const getBooks = createAsyncThunk('books/getAll', async (_, thunkAPI) => {
  try {
    return await bookService.getBooks();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// --- NOUVEAU : Récupérer les livres "FEATURED" (Sélection) ---
export const getFeaturedBooks = createAsyncThunk('books/getFeatured', async (_, thunkAPI) => {
  try {
    // Appel vers https://bookstore-d1k4.onrender.com/api/books/featured
    const response = await axios.get(API_URL + 'featured');
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Supprimer un livre
export const deleteBook = createAsyncThunk('books/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await bookService.deleteBook(id, token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Mettre à jour un livre (Prix, Stock, Featured...)
export const updateBook = createAsyncThunk('books/update', async ({ id, bookData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + id, bookData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});

// Récupérer UN SEUL livre (Détails)
export const getBookDetails = createAsyncThunk('books/getOne', async (id, thunkAPI) => {
  try {
    const response = await axios.get(API_URL + id);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});

// --- Le Slice ---

export const bookSlice = createSlice({
  name: 'book',
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
      // CREATE
      .addCase(createBook.pending, (state) => { state.isLoading = true; })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books.push(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // GET ALL
      .addCase(getBooks.pending, (state) => { state.isLoading = true; })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books = action.payload;
      })

      // --- NOUVEAU : GET FEATURED ---
      .addCase(getFeaturedBooks.pending, (state) => { 
        state.isLoading = true; 
      })
      .addCase(getFeaturedBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        // On remplit le tableau spécifique, pas le tableau principal
        state.featuredBooks = action.payload; 
      })

      // DELETE
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books = state.books.filter((book) => book._id !== action.payload.id);
      })

      // UPDATE
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Mise à jour dans la liste principale
        const index = state.books.findIndex((book) => book._id === action.payload._id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })

      // GET ONE (DETAILS)
      .addCase(getBookDetails.pending, (state) => { state.isLoading = true; })
      .addCase(getBookDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.book = action.payload;
      })
      .addCase(getBookDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = bookSlice.actions;
export default bookSlice.reducer;