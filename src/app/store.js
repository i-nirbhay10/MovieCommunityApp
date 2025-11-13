import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import watchlistReducer from '../features/watchlistSlice';
import moviesReducer from '../features/moviesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    watchlist: watchlistReducer,
    movies: moviesReducer,
  },
});
