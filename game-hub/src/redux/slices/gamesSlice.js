import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async ({ page = 1, filters = {} }) => {
    try {
      // Ensure page is a valid number
      const pageNumber = parseInt(page, 10) || 1;
      
      // Prepare API parameters
      const params = new URLSearchParams({
        key: RAWG_API_KEY,
        page: pageNumber.toString(),
        page_size: '20',
      });
      
      // Add filters to params if they exist
      if (filters.genres) params.append('genres', filters.genres);
      if (filters.tags) params.append('tags', filters.tags);
      if (filters.dates) params.append('dates', filters.dates);
      if (filters.ordering) params.append('ordering', filters.ordering);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`${BASE_URL}/games?${params.toString()}`);
      return {
        ...response.data,
        requestedPage: pageNumber // Add the requested page to the response
      };
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    totalPages: 0,
    currentPage: 1,
    filters: {
      category: '',
      tags: '',
      releaseYear: '',
      ordering: '-rating',
      search: '',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.results;
        state.totalPages = Math.ceil(action.payload.count / 20);
        state.currentPage = action.payload.requestedPage; // Use the requested page
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setFilters, setCurrentPage } = gamesSlice.actions;
export default gamesSlice.reducer; 