import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import  api  from '@/utils/api';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  userType: 'BUSINESS_ACCOUNT' | 'CUSTOMER';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface BusinessProfile {
  id: string;
  baseUserId: string;
  companyName: string;
  businessType: string;
  taxId?: string;
  phone: string;
  address: string;
  website: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerified: boolean;
  verifiedAt?: string;
  rejectionReason?: string;
  profileCompleted: boolean;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
  venue?: any[];
  createdAt: string;
  updatedAt?: string;
  bankInfo?: {accountNumber: string, accountName: string, bankName: string};
}

export interface CompleteProfile {
  user: UserProfile;
  business?: BusinessProfile;
}

export interface LocationAmenitiesData {
  latitude: number;
  longitude: number;
  fullAddress?: string;
  amenities: string[];
}

export interface CompanyDetailsData {
  companyName: string;
  businessType: string;
  phone: string;
  address: string;
  website?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileState {
  userProfile: UserProfile | null;
  businessProfile: BusinessProfile | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  updateError: string | null;
}

const initialState: ProfileState = {
  userProfile: null,
  businessProfile: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/users/profile');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

export const fetchBusinessProfile = createAsyncThunk(
  'profile/fetchBusinessProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/users/business-profile');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch business profile');
    }
  }
);

export const updateLocationAmenities = createAsyncThunk(
  'profile/updateLocationAmenities',
  async (data: LocationAmenitiesData, { rejectWithValue }) => {
    try {
      const response = await api.put('/api/v1/users/business-profile', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update location and amenities');
    }
  }
);

export const updateCompanyDetails = createAsyncThunk(
  'profile/updateCompanyDetails',
  async (data: CompanyDetailsData, { rejectWithValue }) => {
    try {
      const response = await api.put('/api/v1/users/business-profile/details', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update company details');
    }
  }
);

export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (data: PasswordChangeData, { rejectWithValue }) => {
    try {
      const response = await api.put('/api/v1/users/business-profile/password', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.userProfile = null;
      state.businessProfile = null;
    },
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    setBusinessProfile: (state, action: PayloadAction<BusinessProfile>) => {
      state.businessProfile = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.userProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Business Profile
    builder
      .addCase(fetchBusinessProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.businessProfile = action.payload;
      })
      .addCase(fetchBusinessProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Location & Amenities
    builder
      .addCase(updateLocationAmenities.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateLocationAmenities.fulfilled, (state, action) => {
        state.updating = false;
        state.businessProfile = action.payload;
      })
      .addCase(updateLocationAmenities.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload as string;
      });

    // Update Company Details
    builder
      .addCase(updateCompanyDetails.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateCompanyDetails.fulfilled, (state, action) => {
        state.updating = false;
        state.businessProfile = action.payload;
      })
      .addCase(updateCompanyDetails.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload as string;
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload as string;
      });
  },
});

export const {
  clearProfile,
  clearError,
  setBusinessProfile,
  setUserProfile,
} = profileSlice.actions;

export default profileSlice.reducer;