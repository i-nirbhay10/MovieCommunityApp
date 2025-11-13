import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {fetchTrending} from '../api/tmdb';

export const loadTrending = createAsyncThunk(
  'movies/loadTrending',
  async (page = 1) => {
    const res = await fetchTrending(page);
    return res;
  },
);

const slice = createSlice({
  name: 'movies',
  initialState: {results: [], page: 1, total_pages: 1, status: 'idle'},
  reducers: {},
  extraReducers: b => {
    b.addCase(loadTrending.fulfilled, (s, a) => {
      s.page = a.payload.page;
      s.total_pages = a.payload.total_pages;
      s.results =
        a.payload.page === 1
          ? a.payload.results
          : [...s.results, ...a.payload.results];
      s.status = 'succeeded';
    });
  },
});

export default slice.reducer;
