import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "@/utils/api";

export interface BusinessAccount {
  id: string;
  companyName: string;
  businessType: string;
  phone: string;
  address: string;
  isVerified: boolean;
  verifiedAt: string | null;
}

export interface BusinessUser {
  id: string;
  userType: "BUSINESS_ACCOUNT";
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  isActive: boolean;
  businessAccount: BusinessAccount;
  venueCount: number;
  totalBookings: number;
  isVerified: boolean;
}

export interface BusinessListResponse {
  data: BusinessUser[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface BusinessState {
  businesses: BusinessUser[];
  currentBusiness: BusinessUser | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  lastFetched: number | null;
}

const initialState: BusinessState = {
  businesses: [],
  currentBusiness: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    limit: 0,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  lastFetched: null,
};

// 🗂️ localStorage utility functions for business data
const businessStorage = {
  getCachedBusinesses: (): {
    data: BusinessListResponse;
    timestamp: number;
  } | null => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("businesses_cache");
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.error("Error reading businesses cache:", error);
        return null;
      }
    }
    return null;
  },

  setCachedBusinesses: (data: BusinessListResponse) => {
    if (typeof window !== "undefined") {
      try {
        const cacheData = {
          data,
          timestamp: Date.now(),
        };
        localStorage.setItem("businesses_cache", JSON.stringify(cacheData));
      } catch (error) {
        console.error("Error saving businesses cache:", error);
      }
    }
  },

  clearCachedBusinesses: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("businesses_cache");
      } catch (error) {
        console.error("Error clearing businesses cache:", error);
      }
    }
  },

  // Check if cache is still valid (5 minutes)
  isCacheValid: (timestamp: number): boolean => {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    return Date.now() - timestamp < CACHE_DURATION;
  },
};

// 🔐 Get Businesses Thunk with Caching
export const getBusinesses = createAsyncThunk(
  "business/getBusinesses",
  async (
    {
      page = 1,
      limit = 10,
      forceRefresh = false,
    }: { page?: number; limit?: number; forceRefresh?: boolean } = {},
    { rejectWithValue }
  ) => {
    try {
      // Check cache first unless force refresh is requested
      if (!forceRefresh) {
        const cached = businessStorage.getCachedBusinesses();
        if (cached && businessStorage.isCacheValid(cached.timestamp)) {
          console.log("📦 Using cached businesses data");
          return cached.data;
        }
      }

      console.log("🌐 Fetching fresh businesses data from API");
      const response = await api.get(
        `/api/v1/admin/users/business?page=${page}&limit=${limit}`
      );

      // Cache the successful response
      businessStorage.setCachedBusinesses(response.data);

      return response.data;
    } catch (error: unknown) {
      // If API fails, try to use cache as fallback
      const cached = businessStorage.getCachedBusinesses();
      if (cached && businessStorage.isCacheValid(cached.timestamp)) {
        console.log("🔄 API failed, using cached data as fallback");
        return cached.data;
      }

      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch businesses";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Get Business by ID Thunk
export const getBusinessById = createAsyncThunk(
  "business/getBusinessById",
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/business/${businessId}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch business";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Update Business Thunk
export const updateBusiness = createAsyncThunk(
  "business/updateBusiness",
  async (
    {
      id,
      businessData,
    }: { id: string; businessData: Partial<BusinessAccount> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/api/v1/admin/users/business/${id}/review`,
        businessData
      );

      // Clear cache when business is updated to ensure fresh data next time
      businessStorage.clearCachedBusinesses();
      console.log("🗑️ Cleared business cache due to update");

      return response.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update business";
      return rejectWithValue(errorMessage);
    }
  }
);

// Add this new thunk for status updates
export const updateBusinessStatus = createAsyncThunk(
  "business/updateBusinessStatus",
  async (
    { id, action, notes }: { id: string; action: string; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        // Use PATCH instead of PUT
        `/api/v1/admin/users/business/${id}/review`,
        { action, notes }
      );

      // Clear cache when business status is updated
      businessStorage.clearCachedBusinesses();
      console.log("🗑️ Cleared business cache due to status update");

      return response.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update business status";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🧠 Slice logic
const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setCurrentBusiness: (state, action: PayloadAction<BusinessUser | null>) => {
      state.currentBusiness = action.payload;
    },
    updateBusinessLocal: (
      state,
      action: PayloadAction<Partial<BusinessUser>>
    ) => {
      if (state.currentBusiness) {
        state.currentBusiness = { ...state.currentBusiness, ...action.payload };
      }
      // Also update in businesses list if exists
      const businessIndex = state.businesses.findIndex(
        (business) => business.id === action.payload.id
      );
      if (businessIndex !== -1) {
        state.businesses[businessIndex] = {
          ...state.businesses[businessIndex],
          ...action.payload,
        };
      }

      // Clear cache when local updates happen
      businessStorage.clearCachedBusinesses();
    },
    clearBusinessError: (state) => {
      state.error = null;
    },
    clearBusinesses: (state) => {
      state.businesses = [];
      state.pagination = initialState.pagination;
      state.lastFetched = null;
      businessStorage.clearCachedBusinesses();
    },
    refreshBusinesses: (state) => {
      // Force refresh on next fetch
      state.lastFetched = null;
      businessStorage.clearCachedBusinesses();
    },
    // Load initial state from cache
    loadBusinessesFromCache: (state) => {
      const cached = businessStorage.getCachedBusinesses();
      if (cached && businessStorage.isCacheValid(cached.timestamp)) {
        state.businesses = cached.data.data;
        state.pagination = {
          page: cached.data.page,
          limit: cached.data.limit,
          total: cached.data.total,
          totalPages: cached.data.totalPages,
          hasNext: cached.data.hasNext,
          hasPrev: cached.data.hasPrev,
        };
        state.lastFetched = cached.timestamp;
        state.loading = false;
        console.log("📦 Loaded businesses from cache");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Businesses
      .addCase(getBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
          hasNext: action.payload.hasNext,
          hasPrev: action.payload.hasPrev,
        };
        state.lastFetched = Date.now();
        state.error = null;
        console.log("✅ Businesses loaded successfully");
      })
      .addCase(getBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ Failed to load businesses:", action.payload);
      })
      // Get Business by ID
      .addCase(getBusinessById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBusinessById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBusiness = action.payload;
        state.error = null;
      })
      .addCase(getBusinessById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Business
      .addCase(updateBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBusiness = action.payload;
        // Update in businesses list if exists
        const businessIndex = state.businesses.findIndex(
          (business) => business.id === action.payload.id
        );
        if (businessIndex !== -1) {
          state.businesses[businessIndex] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// 🎯 Export actions
export const {
  setCurrentBusiness,
  updateBusinessLocal,
  clearBusinessError,
  clearBusinesses,
  refreshBusinesses,
  loadBusinessesFromCache,
} = businessSlice.actions;

export default businessSlice.reducer;

// 🧠 Selectors
export const selectBusinesses = (state: { business: BusinessState }) =>
  state.business.businesses;
export const selectCurrentBusiness = (state: { business: BusinessState }) =>
  state.business.currentBusiness;
export const selectBusinessLoading = (state: { business: BusinessState }) =>
  state.business.loading;
export const selectBusinessError = (state: { business: BusinessState }) =>
  state.business.error;
export const selectBusinessPagination = (state: { business: BusinessState }) =>
  state.business.pagination;
export const selectLastFetched = (state: { business: BusinessState }) =>
  state.business.lastFetched;
