import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {load, save} from '../utils/storage';

const KEY = 'WATCHLIST';

export const loadWatchlist = createAsyncThunk('watchlist/load', async () => {
  return await load(KEY, []);
});

export const persistWatchlist = createAsyncThunk(
  'watchlist/save',
  async (_, {getState}) => {
    const list = getState().watchlist.list; // safely access current list
    await save(KEY, list);
    return list;
  },
);

const slice = createSlice({
  name: 'watchlist',
  initialState: {list: [], status: 'idle'},
  reducers: {
    addMovie(state, action) {
      const movie = action.payload;
      if (!state.list.find(m => m.id === movie.id)) {
        state.list.push(movie);
      }
    },
    removeMovie(state, action) {
      state.list = state.list.filter(m => m.id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(loadWatchlist.fulfilled, (s, a) => {
      s.list = a.payload;
    });
    builder.addCase(persistWatchlist.fulfilled, (s, a) => {
      s.list = a.payload;
    });
  },
});

export const {addMovie, removeMovie} = slice.actions;
export default slice.reducer;
