import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {load, save} from '../utils/storage';

const USERS_KEY = 'USERS_DB';
const CURRENT_KEY = 'CURRENT_USER';

export const loadInitialAuth = createAsyncThunk(
  'auth/loadInitial',
  async () => {
    const current = await load(CURRENT_KEY);
    return {currentUser: current};
  },
);

export const registerUser = createAsyncThunk('auth/register', async user => {
  const users = (await load(USERS_KEY, [])) || [];
  // basic check: unique email
  if (users.find(u => u.email === user.email)) throw new Error('User exists');
  const newUsers = [...users, user];
  await save(USERS_KEY, newUsers);
  await save(CURRENT_KEY, user);
  return user;
});

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({email, password}) => {
    const users = (await load(USERS_KEY, [])) || [];
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid credentials');
    await save(CURRENT_KEY, found);
    return found;
  },
);

export const logoutUser = createAsyncThunk('auth/logoutUser ', async () => {
  await save(CURRENT_KEY, null);
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {user: null, status: 'idle', error: null},
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadInitialAuth.fulfilled, (s, a) => {
        s.user = a.payload.currentUser;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.user = a.payload;
        s.error = null;
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.error = a.error.message;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.user = a.payload;
        s.error = null;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.error = a.error.message;
      })
      .addCase(logoutUser.fulfilled, s => {
        s.user = null;
      });
  },
});

export default authSlice.reducer;
