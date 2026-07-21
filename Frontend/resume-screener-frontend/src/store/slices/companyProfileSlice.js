import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import companyProfileAPI from '../../api/companyProfileApi';

export const fetchCompanyProfile = createAsyncThunk(
  'companyProfile/fetchCompanyProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await companyProfileAPI.getProfile();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateCompanyProfile = createAsyncThunk(
  'companyProfile/updateCompanyProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      return await companyProfileAPI.updateProfile(profileData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadCompanyLogo = createAsyncThunk(
  'companyProfile/uploadCompanyLogo',
  async (file, { rejectWithValue }) => {
    try {
      return await companyProfileAPI.uploadLogo(file);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to upload logo');
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  saving: false,
  error: null,
  success: false,
  successMessage: '',
  isEditing: false
};

const companyProfileSlice = createSlice({
  name: 'companyProfile',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = false; state.successMessage = ''; },
    setIsEditing: (state, action) => { state.isEditing = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data ?? action.payload;
      })
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCompanyProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.success = true;
        state.successMessage = 'Profile updated successfully';
        state.profile = action.payload?.data ?? action.payload;
        state.isEditing = false;
      })
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      .addCase(uploadCompanyLogo.fulfilled, (state, action) => {
        const updated = action.payload?.data ?? action.payload;
        if (state.profile) state.profile.logoUrl = updated.logoUrl;
      })
      .addCase(uploadCompanyLogo.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, setIsEditing } = companyProfileSlice.actions;
export default companyProfileSlice.reducer;