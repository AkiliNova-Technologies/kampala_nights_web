// redux/slices/djProfileSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '@/utils/api';

// Types
export interface DJProfile {
  id: string;
  userId: string;
  fullName: string;
  djUsername: string;
  genre: string;
  status: 'PENDING' | 'ENABLED' | 'DISABLED';
  bio?: string;
  socials: Array<{
    platform: string;
    url: string;
  }>;
  profileImageUrl?: string;
  backgroundImageUrl?: string;
  favoriteCount: number;
  isFavorited?: boolean;
  
  // Additional fields to match your Profile type
  location?: string;
  city?: string;
  country?: string;
  eventsPlayed?: number;
  rating?: number;
  phone?: string;
  email?: string;
  experience?: string;
  equipment?: string[];
  performanceTypes?: string[];
  venuesPlayed?: string[];
  availability?: {
    isAvailable: boolean;
    bookingPrice?: number;
    currency?: string;
    minimumNotice?: number;
  };
  
  createdAt: string;
  updatedAt?: string;
}

export interface DJGig {
  id: string;
  djId: string;
  title: string;
  caption?: string;
  posterImageUrl?: string;
  venue: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  ticketPrice?: number;
  ticketUrl?: string;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  visibility: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  dj?: {
    id: string;
    fullName: string;
    djUsername: string;
    genre: string;
    profileImageUrl?: string;
  };
}

export interface DJFavorite {
  id: string;
  userId: string;
  djId: string;
  createdAt: string;
  dj?: DJProfile;
}

export interface DJFavoriteStats {
  totalFavorites: number;
  isFavorited: boolean;
  djId: string;
}

export interface DJStats {
  total: number;
  active: number;
  disabled: number;
  drafts: number;
  averageRating: number;
  totalFollowers: number;
  totalEvents: number;
}

export interface GigStats {
  total: number;
  active: number;
  cancelled: number;
  completed: number;
  tonight: number;
}

export interface DJPhoto {
  id: string;
  djId: string;
  imageUrl: string;
  caption?: string;
  createdAt: string;
}

export interface DJReport {
  id: string;
  djId: string;
  userId: string;
  reason: string;
  description?: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
}

export interface DJsResponse {
  djs: DJProfile[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface GigsResponse {
  gigs: DJGig[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface FavoritesResponse {
  favorites: DJFavorite[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface PhotosResponse {
  photos: DJPhoto[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Create DJ Profile Data
export interface CreateDJProfileData {
  userId: string;
  fullName: string;
  djUsername: string;
  genre: string;
  bio?: string;
  status?: 'PENDING' | 'ENABLED' | 'DISABLED';
  socials: Array<{
    platform: string;
    url: string;
  }>;
  phone?: string;
  email?: string;
  location?: string;
  city?: string;
  country?: string; 
  experience?: string;
  profileImageUrl?: string;
  backgroundImageUrl?: string;
}

// Update DJ Profile Data
export interface UpdateDJProfileData {
  fullName?: string;
  djUsername?: string;
  genre?: string;
  bio?: string;
  status?: 'PENDING' | 'ENABLED' | 'DISABLED';
  socials?: Array<{
    platform: string;
    url: string;
  }>;
  phone?: string;
  email?: string;
  location?: string;
  city?: string;
  country?: string;
  experience?: string;
  profileImageUrl?: string;
  backgroundImageUrl?: string;
}

// Create DJ Gig Data
export interface CreateDJGigData {
  djId: string;
  title: string;
  caption?: string;
  posterImageUrl?: string;
  venue: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  ticketPrice?: number;
  ticketUrl?: string;
  visibility: 'DRAFT' | 'PUBLISHED';
}

// Update DJ Gig Data
export interface UpdateDJGigData {
  title?: string;
  caption?: string;
  posterImageUrl?: string;
  venue?: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  ticketPrice?: number;
  ticketUrl?: string;
  status?: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  visibility?: 'DRAFT' | 'PUBLISHED';
}

// Update DJ Status Data
export interface UpdateDJStatusData {
  status: 'PENDING' | 'ENABLED' | 'DISABLED';
}

// Update Gig Visibility Data
export interface UpdateGigVisibilityData {
  visibility: 'DRAFT' | 'PUBLISHED';
}

// Report DJ Data
export interface ReportDJData {
  reason: string;
  description?: string;
}

// Add Photo Data
export interface AddPhotoData {
  imageUrl: string;
  caption?: string;
}

// DJs Filter Params
export interface DJsFilterParams {
  genre?: string;
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Gigs Filter Params
export interface GigsFilterParams {
  page?: number;
  limit?: number;
  djId?: string;
  status?: string;
  visibility?: string;
  fromDate?: string;
  toDate?: string;
}

interface DJProfileState {
  // DJ Profiles
  allDJs: DJProfile[];
  currentDJ: DJProfile | null;
  djLoading: boolean;
  djError: string | null;
  
  // DJ Gigs
  allGigs: DJGig[];
  tonightGigs: DJGig[];
  currentGig: DJGig | null;
  gigsLoading: boolean;
  gigsError: string | null;
  
  // Favorites
  userFavorites: DJFavorite[];
  favoriteStats: Record<string, DJFavoriteStats>;
  favoritesLoading: boolean;
  favoritesError: string | null;
  
  // Photos
  djPhotos: DJPhoto[];
  photosLoading: boolean;
  photosError: string | null;
  
  // Statistics
  djStats: DJStats | null;
  gigStats: GigStats | null;
  statsLoading: boolean;
  statsError: string | null;
  
  // Pagination
  djsPagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  gigsPagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  favoritesPagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  photosPagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  
  // Operations
  creating: boolean;
  updating: boolean;
  favoriting: boolean;
  deleting: boolean;
}

const initialState: DJProfileState = {
  // DJ Profiles
  allDJs: [],
  currentDJ: null,
  djLoading: false,
  djError: null,
  
  // DJ Gigs
  allGigs: [],
  tonightGigs: [],
  currentGig: null,
  gigsLoading: false,
  gigsError: null,
  
  // Favorites
  userFavorites: [],
  favoriteStats: {},
  favoritesLoading: false,
  favoritesError: null,
  
  // Photos
  djPhotos: [],
  photosLoading: false,
  photosError: null,
  
  // Statistics
  djStats: null,
  gigStats: null,
  statsLoading: false,
  statsError: null,
  
  // Pagination
  djsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
  gigsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
  favoritesPagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
  photosPagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
  
  // Operations
  creating: false,
  updating: false,
  favoriting: false,
  deleting: false,
};

// Async Thunks

// ========== DJ PROFILE THUNKS ==========

// Create DJ Profile (Admin only)
export const createDJProfile = createAsyncThunk(
  'djProfile/createDJProfile',
  async (data: CreateDJProfileData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/djs', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create DJ profile');
    }
  }
);

// Get All DJs (Admin only)
export const fetchAllDJs = createAsyncThunk(
  'djProfile/fetchAllDJs',
  async (params: DJsFilterParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/djs', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch DJs');
    }
  }
);

// Get Public DJs
export const fetchPublicDJs = createAsyncThunk(
  'djProfile/fetchPublicDJs',
  async (params: DJsFilterParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/djs/public', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch public DJs');
    }
  }
);

// Get DJ by ID
export const fetchDJById = createAsyncThunk(
  'djProfile/fetchDJById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/djs/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch DJ profile');
    }
  }
);

// Get DJ by Username
export const fetchDJByUsername = createAsyncThunk(
  'djProfile/fetchDJByUsername',
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/djs/username/${username}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch DJ profile');
    }
  }
);

// Get Current User DJ Profile
export const fetchCurrentUserDJProfile = createAsyncThunk(
  'djProfile/fetchCurrentUserDJProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/djs/me');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current user DJ profile');
    }
  }
);

// Update DJ Profile (Admin only)
export const updateDJProfile = createAsyncThunk(
  'djProfile/updateDJProfile',
  async ({ id, data }: { id: string; data: UpdateDJProfileData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/v1/djs/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update DJ profile');
    }
  }
);

// Update DJ Status (Admin only)
export const updateDJStatus = createAsyncThunk(
  'djProfile/updateDJStatus',
  async ({ djId, status }: { djId: string; status: UpdateDJStatusData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/v1/djs/${djId}/status`, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update DJ status');
    }
  }
);

// Delete DJ Profile (Admin only)
export const deleteDJProfile = createAsyncThunk(
  'djProfile/deleteDJProfile',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/djs/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete DJ profile');
    }
  }
);

// Report a DJ
export const reportDJ = createAsyncThunk(
  'djProfile/reportDJ',
  async ({ djId, data }: { djId: string; data: ReportDJData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/djs/${djId}/report`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to report DJ');
    }
  }
);

// Share DJ's Profile
export const shareDJProfile = createAsyncThunk(
  'djProfile/shareDJProfile',
  async (djId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/djs/${djId}/share`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to share DJ profile');
    }
  }
);

// ========== DJ GIG THUNKS ==========

// Create DJ Gig (Admin only)
export const createDJGig = createAsyncThunk(
  'djProfile/createDJGig',
  async (data: CreateDJGigData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/djs/gigs', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create DJ gig');
    }
  }
);

// Get All DJ Gigs (Admin only)
export const fetchDJGigs = createAsyncThunk(
  'djProfile/fetchDJGigs',
  async (params: GigsFilterParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/djs/gigs', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch DJ gigs');
    }
  }
);

// Get Public DJ Gigs
export const fetchPublicDJGigs = createAsyncThunk(
  'djProfile/fetchPublicDJGigs',
  async (params: GigsFilterParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/djs/gigs/public', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch public DJ gigs');
    }
  }
);

// Get Tonight's Gigs
export const fetchTonightGigs = createAsyncThunk(
  'djProfile/fetchTonightGigs',
  async (params: GigsFilterParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/djs/gigs/tonight', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tonight gigs');
    }
  }
);

// Get DJ Gig by ID
export const fetchDJGigById = createAsyncThunk(
  'djProfile/fetchDJGigById',
  async (gigId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/djs/gigs/${gigId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch DJ gig');
    }
  }
);

// Get Gigs by DJ
export const fetchGigsByDJ = createAsyncThunk(
  'djProfile/fetchGigsByDJ',
  async (djId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/djs/${djId}/gigs`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs by DJ');
    }
  }
);

// Get Past Plays for DJ
export const fetchPastPlays = createAsyncThunk(
  'djProfile/fetchPastPlays',
  async (djId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/djs/${djId}/past-plays`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch past plays');
    }
  }
);

// Get Coming Plays for DJ
export const fetchComingPlays = createAsyncThunk(
  'djProfile/fetchComingPlays',
  async (djId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/djs/${djId}/coming-plays`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch coming plays');
    }
  }
);

// Update DJ Gig (Admin only)
export const updateDJGig = createAsyncThunk(
  'djProfile/updateDJGig',
  async ({ gigId, data }: { gigId: string; data: UpdateDJGigData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/v1/djs/gigs/${gigId}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update DJ gig');
    }
  }
);

// Delete DJ Gig (Admin only)
export const deleteDJGig = createAsyncThunk(
  'djProfile/deleteDJGig',
  async (gigId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/djs/gigs/${gigId}`);
      return gigId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete DJ gig');
    }
  }
);

// ========== FAVORITE THUNKS ==========

// Add DJ to Favorites
export const addDJToFavorites = createAsyncThunk(
  'djProfile/addDJToFavorites',
  async (djId: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/djs/favorites', { djId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add DJ to favorites');
    }
  }
);

// Remove DJ from Favorites
export const removeDJFromFavorites = createAsyncThunk(
  'djProfile/removeDJFromFavorites',
  async (djId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/djs/favorites/${djId}`);
      return djId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove DJ from favorites');
    }
  }
);

// Get User Favorite DJs
export const fetchUserFavorites = createAsyncThunk(
  'djProfile/fetchUserFavorites',
  async (params: DJsFilterParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/djs/favorites', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user favorites');
    }
  }
);

// Get DJ Favorite Statistics
export const fetchDJFavoriteStats = createAsyncThunk(
  'djProfile/fetchDJFavoriteStats',
  async (djId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/djs/${djId}/favorites/stats`);
      return { djId, stats: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch DJ favorite stats');
    }
  }
);

// Check if User has Favorited DJ
export const checkUserFavorite = createAsyncThunk(
  'djProfile/checkUserFavorite',
  async (djId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/djs/${djId}/favorites/check`);
      return { djId, isFavorited: response.data.isFavorited };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check favorite status');
    }
  }
);

// ========== PHOTO THUNKS ==========

// Add Photos to DJ (Admin only)
export const addDJPhotos = createAsyncThunk(
  'djProfile/addDJPhotos',
  async ({ djId, data }: { djId: string; data: AddPhotoData[] }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/djs/${djId}/photos`, { photos: data });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add photos to DJ');
    }
  }
);

// Get DJ Photos
export const fetchDJPhotos = createAsyncThunk(
  'djProfile/fetchDJPhotos',
  async (djId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/djs/${djId}/photos`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch DJ photos');
    }
  }
);

// Delete DJ Photo (Admin only)
export const deleteDJPhoto = createAsyncThunk(
  'djProfile/deleteDJPhoto',
  async ({ djId, photoId }: { djId: string; photoId: string }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/djs/${djId}/photos/${photoId}`);
      return { djId, photoId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete DJ photo');
    }
  }
);

// ========== STATISTICS THUNKS ==========

// Get DJ Statistics
export const fetchDJStats = createAsyncThunk(
  'djProfile/fetchDJStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/djs/stats');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch DJ statistics');
    }
  }
);

// Get DJ Gig Statistics
export const fetchGigStats = createAsyncThunk(
  'djProfile/fetchGigStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/djs/gigs/stats');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gig statistics');
    }
  }
);

const djProfileSlice = createSlice({
  name: 'djProfile',
  initialState,
  reducers: {
    // Clear state
    clearDJProfile: (state) => {
      state.currentDJ = null;
      state.djError = null;
    },
    clearDJGigs: (state) => {
      state.allGigs = [];
      state.tonightGigs = [];
      state.currentGig = null;
      state.gigsError = null;
    },
    clearFavorites: (state) => {
      state.userFavorites = [];
      state.favoriteStats = {};
      state.favoritesError = null;
    },
    clearPhotos: (state) => {
      state.djPhotos = [];
      state.photosError = null;
    },
    clearStats: (state) => {
      state.djStats = null;
      state.gigStats = null;
      state.statsError = null;
    },
    clearAll: (state) => {
      Object.assign(state, initialState);
    },
    
    // Clear errors
    clearError: (state) => {
      state.djError = null;
      state.gigsError = null;
      state.favoritesError = null;
      state.photosError = null;
      state.statsError = null;
    },
    
    // Optimistic updates
    setCurrentDJ: (state, action: PayloadAction<DJProfile>) => {
      state.currentDJ = action.payload;
    },
    setFavoriteStatus: (state, action: PayloadAction<{ djId: string; isFavorited: boolean }>) => {
      const { djId, isFavorited } = action.payload;
      
      // Update current DJ if it matches
      if (state.currentDJ?.id === djId) {
        state.currentDJ.isFavorited = isFavorited;
        state.currentDJ.favoriteCount += isFavorited ? 1 : -1;
      }
      
      // Update in allDJs list
      const djIndex = state.allDJs.findIndex(dj => dj.id === djId);
      if (djIndex !== -1) {
        state.allDJs[djIndex].isFavorited = isFavorited;
        state.allDJs[djIndex].favoriteCount += isFavorited ? 1 : -1;
      }
      
      // Update favorite stats
      if (state.favoriteStats[djId]) {
        state.favoriteStats[djId].isFavorited = isFavorited;
        state.favoriteStats[djId].totalFavorites += isFavorited ? 1 : -1;
      }
    },
  },
  extraReducers: (builder) => {
    // ========== DJ PROFILE REDUCERS ==========
    
    // Create DJ Profile
    builder
      .addCase(createDJProfile.pending, (state) => {
        state.creating = true;
        state.djError = null;
      })
      .addCase(createDJProfile.fulfilled, (state, action) => {
        state.creating = false;
        state.allDJs.unshift(action.payload);
      })
      .addCase(createDJProfile.rejected, (state, action) => {
        state.creating = false;
        state.djError = action.payload as string;
      });

    // Fetch All DJs
    builder
      .addCase(fetchAllDJs.pending, (state) => {
        state.djLoading = true;
        state.djError = null;
      })
      .addCase(fetchAllDJs.fulfilled, (state, action) => {
        state.djLoading = false;
        state.allDJs = action.payload.djs;
        state.djsPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(fetchAllDJs.rejected, (state, action) => {
        state.djLoading = false;
        state.djError = action.payload as string;
      });

    // Fetch Public DJs
    builder
      .addCase(fetchPublicDJs.pending, (state) => {
        state.djLoading = true;
        state.djError = null;
      })
      .addCase(fetchPublicDJs.fulfilled, (state, action) => {
        state.djLoading = false;
        state.allDJs = action.payload.djs;
        state.djsPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(fetchPublicDJs.rejected, (state, action) => {
        state.djLoading = false;
        state.djError = action.payload as string;
      });

    // Fetch DJ by ID
    builder
      .addCase(fetchDJById.pending, (state) => {
        state.djLoading = true;
        state.djError = null;
      })
      .addCase(fetchDJById.fulfilled, (state, action) => {
        state.djLoading = false;
        state.currentDJ = action.payload;
      })
      .addCase(fetchDJById.rejected, (state, action) => {
        state.djLoading = false;
        state.djError = action.payload as string;
      });

    // Fetch DJ by Username
    builder
      .addCase(fetchDJByUsername.pending, (state) => {
        state.djLoading = true;
        state.djError = null;
      })
      .addCase(fetchDJByUsername.fulfilled, (state, action) => {
        state.djLoading = false;
        state.currentDJ = action.payload;
      })
      .addCase(fetchDJByUsername.rejected, (state, action) => {
        state.djLoading = false;
        state.djError = action.payload as string;
      });

    // Fetch Current User DJ Profile
    builder
      .addCase(fetchCurrentUserDJProfile.pending, (state) => {
        state.djLoading = true;
        state.djError = null;
      })
      .addCase(fetchCurrentUserDJProfile.fulfilled, (state, action) => {
        state.djLoading = false;
        state.currentDJ = action.payload;
      })
      .addCase(fetchCurrentUserDJProfile.rejected, (state, action) => {
        state.djLoading = false;
        state.djError = action.payload as string;
      });

    // Update DJ Profile
    builder
      .addCase(updateDJProfile.pending, (state) => {
        state.updating = true;
        state.djError = null;
      })
      .addCase(updateDJProfile.fulfilled, (state, action) => {
        state.updating = false;
        // Update in allDJs list
        const index = state.allDJs.findIndex(dj => dj.id === action.payload.id);
        if (index !== -1) {
          state.allDJs[index] = action.payload;
        }
        // Update current DJ if it matches
        if (state.currentDJ?.id === action.payload.id) {
          state.currentDJ = action.payload;
        }
      })
      .addCase(updateDJProfile.rejected, (state, action) => {
        state.updating = false;
        state.djError = action.payload as string;
      });

    // Update DJ Status
    builder
      .addCase(updateDJStatus.pending, (state) => {
        state.updating = true;
        state.djError = null;
      })
      .addCase(updateDJStatus.fulfilled, (state, action) => {
        state.updating = false;
        // Update in allDJs list
        const index = state.allDJs.findIndex(dj => dj.id === action.payload.id);
        if (index !== -1) {
          state.allDJs[index] = action.payload;
        }
        // Update current DJ if it matches
        if (state.currentDJ?.id === action.payload.id) {
          state.currentDJ = action.payload;
        }
      })
      .addCase(updateDJStatus.rejected, (state, action) => {
        state.updating = false;
        state.djError = action.payload as string;
      });

    // Delete DJ Profile
    builder
      .addCase(deleteDJProfile.pending, (state) => {
        state.deleting = true;
        state.djError = null;
      })
      .addCase(deleteDJProfile.fulfilled, (state, action) => {
        state.deleting = false;
        state.allDJs = state.allDJs.filter(dj => dj.id !== action.payload);
        if (state.currentDJ?.id === action.payload) {
          state.currentDJ = null;
        }
      })
      .addCase(deleteDJProfile.rejected, (state, action) => {
        state.deleting = false;
        state.djError = action.payload as string;
      });

    // ========== DJ GIG REDUCERS ==========

    // Create DJ Gig
    builder
      .addCase(createDJGig.pending, (state) => {
        state.creating = true;
        state.gigsError = null;
      })
      .addCase(createDJGig.fulfilled, (state, action) => {
        state.creating = false;
        state.allGigs.unshift(action.payload);
      })
      .addCase(createDJGig.rejected, (state, action) => {
        state.creating = false;
        state.gigsError = action.payload as string;
      });

    // Fetch DJ Gigs
    builder
      .addCase(fetchDJGigs.pending, (state) => {
        state.gigsLoading = true;
        state.gigsError = null;
      })
      .addCase(fetchDJGigs.fulfilled, (state, action) => {
        state.gigsLoading = false;
        state.allGigs = action.payload.gigs;
        state.gigsPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(fetchDJGigs.rejected, (state, action) => {
        state.gigsLoading = false;
        state.gigsError = action.payload as string;
      });

    // Fetch Public DJ Gigs
    builder
      .addCase(fetchPublicDJGigs.pending, (state) => {
        state.gigsLoading = true;
        state.gigsError = null;
      })
      .addCase(fetchPublicDJGigs.fulfilled, (state, action) => {
        state.gigsLoading = false;
        state.allGigs = action.payload.gigs;
        state.gigsPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(fetchPublicDJGigs.rejected, (state, action) => {
        state.gigsLoading = false;
        state.gigsError = action.payload as string;
      });

    // Fetch Tonight Gigs
    builder
      .addCase(fetchTonightGigs.pending, (state) => {
        state.gigsLoading = true;
        state.gigsError = null;
      })
      .addCase(fetchTonightGigs.fulfilled, (state, action) => {
        state.gigsLoading = false;
        state.tonightGigs = action.payload.gigs;
        state.gigsPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(fetchTonightGigs.rejected, (state, action) => {
        state.gigsLoading = false;
        state.gigsError = action.payload as string;
      });

    // Fetch DJ Gig by ID
    builder
      .addCase(fetchDJGigById.pending, (state) => {
        state.gigsLoading = true;
        state.gigsError = null;
      })
      .addCase(fetchDJGigById.fulfilled, (state, action) => {
        state.gigsLoading = false;
        state.currentGig = action.payload;
      })
      .addCase(fetchDJGigById.rejected, (state, action) => {
        state.gigsLoading = false;
        state.gigsError = action.payload as string;
      });

    // Fetch Gigs by DJ
    builder
      .addCase(fetchGigsByDJ.pending, (state) => {
        state.gigsLoading = true;
        state.gigsError = null;
      })
      .addCase(fetchGigsByDJ.fulfilled, (state, action) => {
        state.gigsLoading = false;
        state.allGigs = action.payload.gigs;
      })
      .addCase(fetchGigsByDJ.rejected, (state, action) => {
        state.gigsLoading = false;
        state.gigsError = action.payload as string;
      });

    // Update DJ Gig
    builder
      .addCase(updateDJGig.pending, (state) => {
        state.updating = true;
        state.gigsError = null;
      })
      .addCase(updateDJGig.fulfilled, (state, action) => {
        state.updating = false;
        // Update in allGigs list
        const index = state.allGigs.findIndex(gig => gig.id === action.payload.id);
        if (index !== -1) {
          state.allGigs[index] = action.payload;
        }
        // Update current gig if it matches
        if (state.currentGig?.id === action.payload.id) {
          state.currentGig = action.payload;
        }
      })
      .addCase(updateDJGig.rejected, (state, action) => {
        state.updating = false;
        state.gigsError = action.payload as string;
      });

    // Delete DJ Gig
    builder
      .addCase(deleteDJGig.pending, (state) => {
        state.deleting = true;
        state.gigsError = null;
      })
      .addCase(deleteDJGig.fulfilled, (state, action) => {
        state.deleting = false;
        state.allGigs = state.allGigs.filter(gig => gig.id !== action.payload);
        if (state.currentGig?.id === action.payload) {
          state.currentGig = null;
        }
      })
      .addCase(deleteDJGig.rejected, (state, action) => {
        state.deleting = false;
        state.gigsError = action.payload as string;
      });

    // ========== FAVORITE REDUCERS ==========

    // Add DJ to Favorites
    builder
      .addCase(addDJToFavorites.pending, (state) => {
        state.favoriting = true;
        state.favoritesError = null;
      })
      .addCase(addDJToFavorites.fulfilled, (state, action) => {
        state.favoriting = false;
        state.userFavorites.unshift(action.payload);
        // Update favorite stats optimistically
        const djId = action.payload.djId;
        if (state.favoriteStats[djId]) {
          state.favoriteStats[djId].isFavorited = true;
          state.favoriteStats[djId].totalFavorites += 1;
        }
      })
      .addCase(addDJToFavorites.rejected, (state, action) => {
        state.favoriting = false;
        state.favoritesError = action.payload as string;
      });

    // Remove DJ from Favorites
    builder
      .addCase(removeDJFromFavorites.pending, (state) => {
        state.favoriting = true;
        state.favoritesError = null;
      })
      .addCase(removeDJFromFavorites.fulfilled, (state, action) => {
        state.favoriting = false;
        state.userFavorites = state.userFavorites.filter(fav => fav.djId !== action.payload);
        // Update favorite stats optimistically
        const djId = action.payload;
        if (state.favoriteStats[djId]) {
          state.favoriteStats[djId].isFavorited = false;
          state.favoriteStats[djId].totalFavorites = Math.max(0, state.favoriteStats[djId].totalFavorites - 1);
        }
      })
      .addCase(removeDJFromFavorites.rejected, (state, action) => {
        state.favoriting = false;
        state.favoritesError = action.payload as string;
      });

    // Fetch User Favorites
    builder
      .addCase(fetchUserFavorites.pending, (state) => {
        state.favoritesLoading = true;
        state.favoritesError = null;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.favoritesLoading = false;
        state.userFavorites = action.payload.favorites;
        state.favoritesPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.favoritesLoading = false;
        state.favoritesError = action.payload as string;
      });

    // Fetch DJ Favorite Stats
    builder
      .addCase(fetchDJFavoriteStats.fulfilled, (state, action) => {
        state.favoriteStats[action.payload.djId] = action.payload.stats;
      });

    // Check User Favorite
    builder
      .addCase(checkUserFavorite.fulfilled, (state, action) => {
        const { djId, isFavorited } = action.payload;
        if (!state.favoriteStats[djId]) {
          state.favoriteStats[djId] = { djId, totalFavorites: 0, isFavorited };
        } else {
          state.favoriteStats[djId].isFavorited = isFavorited;
        }
      });

    // ========== PHOTO REDUCERS ==========

    // Add DJ Photos
    builder
      .addCase(addDJPhotos.pending, (state) => {
        state.creating = true;
        state.photosError = null;
      })
      .addCase(addDJPhotos.fulfilled, (state, action) => {
        state.creating = false;
        state.djPhotos.push(...action.payload.photos);
      })
      .addCase(addDJPhotos.rejected, (state, action) => {
        state.creating = false;
        state.photosError = action.payload as string;
      });

    // Fetch DJ Photos
    builder
      .addCase(fetchDJPhotos.pending, (state) => {
        state.photosLoading = true;
        state.photosError = null;
      })
      .addCase(fetchDJPhotos.fulfilled, (state, action) => {
        state.photosLoading = false;
        state.djPhotos = action.payload.photos;
        state.photosPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(fetchDJPhotos.rejected, (state, action) => {
        state.photosLoading = false;
        state.photosError = action.payload as string;
      });

    // Delete DJ Photo
    builder
      .addCase(deleteDJPhoto.pending, (state) => {
        state.deleting = true;
        state.photosError = null;
      })
      .addCase(deleteDJPhoto.fulfilled, (state, action) => {
        state.deleting = false;
        state.djPhotos = state.djPhotos.filter(photo => photo.id !== action.payload.photoId);
      })
      .addCase(deleteDJPhoto.rejected, (state, action) => {
        state.deleting = false;
        state.photosError = action.payload as string;
      });

    // ========== STATISTICS REDUCERS ==========

    // Fetch DJ Statistics
    builder
      .addCase(fetchDJStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchDJStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.djStats = action.payload;
      })
      .addCase(fetchDJStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload as string;
      });

    // Fetch Gig Statistics
    builder
      .addCase(fetchGigStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchGigStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.gigStats = action.payload;
      })
      .addCase(fetchGigStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload as string;
      });
  },
});

export const {
  clearDJProfile,
  clearDJGigs,
  clearFavorites,
  clearPhotos,
  clearStats,
  clearAll,
  clearError,
  setCurrentDJ,
  setFavoriteStatus,
} = djProfileSlice.actions;

export default djProfileSlice.reducer;