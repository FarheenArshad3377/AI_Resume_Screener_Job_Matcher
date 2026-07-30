import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../../api/authApi.js';

const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await loginUser(credentials);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    return await registerUser(userData);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const result = action.payload?.data ?? action.payload;
        state.token = action.payload.token;
       state.user = {
        fullName: action.payload.fullName,
        email: action.payload.email,
        role: action.payload.role,
        companyName: action.payload.companyName,   // 👈 NEW
        };
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        const result = action.payload?.data ?? action.payload;
        state.token = action.payload.token;
        state.user = {
            fullName: action.payload.fullName,
            email: action.payload.email,
            role: action.payload.role,
            companyName: action.payload.companyName,   // 👈 NEW
            };
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;