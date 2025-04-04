import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './slices/gamesSlice';
import favoritesReducer from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    favorites: favoritesReducer,
  },
}); 