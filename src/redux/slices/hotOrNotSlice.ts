import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "@/utils/api";
import type {
  HotOrNotContest,
  NominationCandidate,
} from "@/types/hot-or-not";


export interface CreateContestData {
  category: string;
  description: string;
  theme: "FASHION" | "NIGHTLIFE";
  status: string;
  durationHours: number;
  contestantPostIds?: string[];
  coverImage?: File;
}

export interface UpdateContestData {
  category?: string;
  description?: string;
  theme?: "FASHION" | "NIGHTLIFE";
  durationHours?: number;
  addContestants?: string[];
  removeContestants?: string[];
  coverImage?: File;
}

export interface AssignNomineesData {
  postIds: string[];
}

export interface VoteData {
  contestId: string;
  contestantId: string;
}

export interface ContestListResponse {
  data: HotOrNotContest[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface NominationCandidatesResponse {
  data: NominationCandidate[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LeaderboardEntry {
  contestantId: string;
  postId: string;
  voteCount: number;
  post: {
    caption: string;
    authorId: string;
    author?: {
      id: string;
      username: string;
      profilePicture?: string;
    };
    PostMedia: Array<{
      id: string;
      url: string;
    }>;
  };
}

export interface ContestAnalytics {
  contestId: string;
  perContestant: Array<{
    contestantId: string;
    postId: string;
    voteCount: number;
    post: {
      caption: string;
      authorId: string;
      PostMedia: Array<{
        id: string;
        url: string;
      }>;
    };
  }>;
  totalVotes: number;
  uniqueVoters: number;
}

interface HotOrNotState {
  contests: HotOrNotContest[];
  currentContest: HotOrNotContest | null;
  nominationCandidates: NominationCandidate[];
  leaderboard: LeaderboardEntry[];
  analytics: ContestAnalytics | null;
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
  mode: "admin" | "public";
}

const initialState: HotOrNotState = {
  contests: [],
  currentContest: null,
  nominationCandidates: [],
  leaderboard: [],
  analytics: null,
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
  mode: "admin",
};

// Storage with mode support
const hotOrNotStorage = {
  getCachedContests: (
    mode: string
  ): {
    data: ContestListResponse;
    timestamp: number;
  } | null => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(`hotornot_contests_cache_${mode}`);
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.error("Error reading hot-or-not contests cache:", error);
        return null;
      }
    }
    return null;
  },

  setCachedContests: (data: ContestListResponse, mode: string) => {
    if (typeof window !== "undefined") {
      try {
        const cacheData = {
          data,
          timestamp: Date.now(),
        };
        localStorage.setItem(`hotornot_contests_cache_${mode}`, JSON.stringify(cacheData));
      } catch (error) {
        console.error("Error saving hot-or-not contests cache:", error);
      }
    }
  },

  getCachedNominationCandidates: (): {
    data: NominationCandidatesResponse;
    timestamp: number;
  } | null => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("hotornot_nomination_candidates_cache");
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.error("Error reading nomination candidates cache:", error);
        return null;
      }
    }
    return null;
  },

  setCachedNominationCandidates: (data: NominationCandidatesResponse) => {
    if (typeof window !== "undefined") {
      try {
        const cacheData = {
          data,
          timestamp: Date.now(),
        };
        localStorage.setItem("hotornot_nomination_candidates_cache", JSON.stringify(cacheData));
      } catch (error) {
        console.error("Error saving nomination candidates cache:", error);
      }
    }
  },

  clearCachedContests: (mode?: string) => {
    if (typeof window !== "undefined") {
      try {
        if (mode) {
          localStorage.removeItem(`hotornot_contests_cache_${mode}`);
        } else {
          // Clear all contest caches
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("hotornot_contests_cache_")) {
              localStorage.removeItem(key);
            }
          });
        }
      } catch (error) {
        console.error("Error clearing hot-or-not contests cache:", error);
      }
    }
  },

  clearCachedNominationCandidates: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("hotornot_nomination_candidates_cache");
      } catch (error) {
        console.error("Error clearing nomination candidates cache:", error);
      }
    }
  },

  isCacheValid: (timestamp: number): boolean => {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    return Date.now() - timestamp < CACHE_DURATION;
  },
};

// Admin endpoints
export const getAdminContests = createAsyncThunk(
  "hotOrNot/getAdminContests",
  async (
    {
      page = 1,
      limit = 10,
      forceRefresh = false,
      theme,
      status,
    }: { 
      page?: number; 
      limit?: number; 
      forceRefresh?: boolean;
      theme?: string;
      status?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      if (!forceRefresh) {
        const cached = hotOrNotStorage.getCachedContests("admin");
        if (cached && hotOrNotStorage.isCacheValid(cached.timestamp)) {
          console.log("📦 Using cached admin contests data");
          return { ...cached.data, mode: "admin" };
        }
      }

      console.log("🌐 Fetching fresh admin contests data from API");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(theme && { theme }),
        ...(status && { status }),
      });

      const response = await api.get(
        `/api/v1/admin/hot-or-not/contests?${params.toString()}`
      );

      hotOrNotStorage.setCachedContests(response.data, "admin");
      console.log("Available Admin Contests: ", response.data);

      return { ...response.data, mode: "admin" };
    } catch (error: unknown) {
      const cached = hotOrNotStorage.getCachedContests("admin");
      if (cached && hotOrNotStorage.isCacheValid(cached.timestamp)) {
        console.log("🔄 API failed, using cached admin data as fallback");
        return { ...cached.data, mode: "admin" };
      }

      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch admin contests";
      return rejectWithValue(errorMessage);
    }
  }
);

// Public endpoints
export const getPublicContests = createAsyncThunk(
  "hotOrNot/getPublicContests",
  async (
    {
      page = 1,
      limit = 10,
      forceRefresh = false,
    }: { page?: number; limit?: number; forceRefresh?: boolean } = {},
    { rejectWithValue }
  ) => {
    try {
      if (!forceRefresh) {
        const cached = hotOrNotStorage.getCachedContests("public");
        if (cached && hotOrNotStorage.isCacheValid(cached.timestamp)) {
          console.log("📦 Using cached public contests data");
          return { ...cached.data, mode: "public" };
        }
      }

      console.log("🌐 Fetching fresh public contests data from API");
      const response = await api.get(
        `/api/v1/hot-or-not/contests?page=${page}&limit=${limit}`
      );

      hotOrNotStorage.setCachedContests(response.data, "public");
      console.log("Available Public Contests: ", response.data);

      return { ...response.data, mode: "public" };
    } catch (error: unknown) {
      const cached = hotOrNotStorage.getCachedContests("public");
      if (cached && hotOrNotStorage.isCacheValid(cached.timestamp)) {
        console.log("🔄 API failed, using cached public data as fallback");
        return { ...cached.data, mode: "public" };
      }

      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch public contests";
      return rejectWithValue(errorMessage);
    }
  }
);

// Create contest (JSON format)
export const createContest = createAsyncThunk(
  "hotOrNot/createContest",
  async (contestData: CreateContestData, { rejectWithValue }) => {
    try {
      // Convert to JSON structure with the same field names
      const jsonData = {
        category: contestData.category,
        description: contestData.description,
        theme: contestData.theme,
        status: contestData.status,
        durationHours: contestData.durationHours.toString(),
        // Keep the same field names but as JSON
        ...(contestData.contestantPostIds && { 
          contestantPostIds: contestData.contestantPostIds 
        }),
        ...(contestData.coverImage && { 
          file: contestData.coverImage // This should be the image URL string
        }),
      };

      console.log('Sending JSON contest data:', jsonData);

      // Send as JSON
      const response = await api.post(
        "/api/v1/admin/hot-or-not/contests/create", 
        jsonData, 
        {
          headers: { 
            'Content-Type': 'application/json',
          }
        }
      );

      hotOrNotStorage.clearCachedContests("admin");
      console.log("🗑️ Cleared admin contests cache due to creation");

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
        "Failed to create contest";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update contest (multipart form data)
export const updateContest = createAsyncThunk(
  "hotOrNot/updateContest",
  async (
    { id, contestData }: { id: string; contestData: UpdateContestData },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      
      if (contestData.category) formData.append('category', contestData.category);
      if (contestData.description) formData.append('description', contestData.description);
      if (contestData.theme) formData.append('theme', contestData.theme);
      if (contestData.durationHours) formData.append('durationHours', contestData.durationHours.toString());
      
      if (contestData.addContestants) {
        contestData.addContestants.forEach(id => {
          formData.append('addContestants', id);
        });
      }
      
      if (contestData.removeContestants) {
        contestData.removeContestants.forEach(id => {
          formData.append('removeContestants', id);
        });
      }
      
      if (contestData.coverImage) {
        formData.append('file', contestData.coverImage);
      }

      const response = await api.put(`/api/v1/admin/hot-or-not/contests/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      hotOrNotStorage.clearCachedContests("admin");
      console.log("🗑️ Cleared admin contests cache due to update");

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
        "Failed to update contest";
      return rejectWithValue(errorMessage);
    }
  }
);

// Publish contest
export const publishContest = createAsyncThunk(
  "hotOrNot/publishContest",
  async (contestId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/admin/hot-or-not/contests/${contestId}/publish`);

      hotOrNotStorage.clearCachedContests("admin");
      hotOrNotStorage.clearCachedContests("public");
      console.log("🗑️ Cleared all contests cache due to publication");

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
        "Failed to publish contest";
      return rejectWithValue(errorMessage);
    }
  }
);

// Assign nominees
export const assignNominees = createAsyncThunk(
  "hotOrNot/assignNominees",
  async (
    { contestId, nomineeData }: { contestId: string; nomineeData: AssignNomineesData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        `/api/v1/admin/hot-or-not/contests/${contestId}/assign-nominees`,
        nomineeData
      );

      hotOrNotStorage.clearCachedContests("admin");
      console.log("🗑️ Cleared admin contests cache due to nominee assignment");

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
        "Failed to assign nominees";
      return rejectWithValue(errorMessage);
    }
  }
);

// Get nomination candidates
export const getNominationCandidates = createAsyncThunk(
  "hotOrNot/getNominationCandidates",
  async (
    {
      page = 1,
      limit = 10,
      forceRefresh = false,
      theme,
    }: { 
      page?: number; 
      limit?: number; 
      forceRefresh?: boolean;
      theme?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      if (!forceRefresh) {
        const cached = hotOrNotStorage.getCachedNominationCandidates();
        if (cached && hotOrNotStorage.isCacheValid(cached.timestamp)) {
          console.log("📦 Using cached nomination candidates data");
          return cached.data;
        }
      }

      console.log("🌐 Fetching fresh nomination candidates data from API");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(theme && { theme }),
      });

      const response = await api.get(
        `/api/v1/admin/hot-or-not/nominees?${params.toString()}`
      );

      hotOrNotStorage.setCachedNominationCandidates(response.data);
      console.log("Available Nomination Candidates: ", response.data);

      return response.data;
    } catch (error: unknown) {
      const cached = hotOrNotStorage.getCachedNominationCandidates();
      if (cached && hotOrNotStorage.isCacheValid(cached.timestamp)) {
        console.log("🔄 API failed, using cached nomination candidates data as fallback");
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
        "Failed to fetch nomination candidates";
      return rejectWithValue(errorMessage);
    }
  }
);

// Get contest by ID
export const getContestById = createAsyncThunk(
  "hotOrNot/getContestById",
  async (contestId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/hot-or-not/contests/${contestId}`);
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
        "Failed to fetch contest";
      return rejectWithValue(errorMessage);
    }
  }
);

// Get leaderboard
export const getLeaderboard = createAsyncThunk(
  "hotOrNot/getLeaderboard",
  async (contestId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/hot-or-not/contests/${contestId}/leaderboard`);
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
        "Failed to fetch leaderboard";
      return rejectWithValue(errorMessage);
    }
  }
);

// Get analytics
export const getContestAnalytics = createAsyncThunk(
  "hotOrNot/getContestAnalytics",
  async (contestId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/admin/hot-or-not/contests/${contestId}/analytics`);
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
        "Failed to fetch contest analytics";
      return rejectWithValue(errorMessage);
    }
  }
);

// Cast vote
export const castVote = createAsyncThunk(
  "hotOrNot/castVote",
  async (voteData: VoteData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/hot-or-not/vote", voteData);
      
      // Clear leaderboard cache since votes changed
      hotOrNotStorage.clearCachedContests("public");
      console.log("🗑️ Cleared public contests cache due to vote");

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
        "Failed to cast vote";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete contest
export const deleteContest = createAsyncThunk(
  "hotOrNot/deleteContest",
  async (contestId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/admin/hot-or-not/contests/${contestId}`);

      hotOrNotStorage.clearCachedContests("admin");
      hotOrNotStorage.clearCachedContests("public");
      console.log("🗑️ Cleared all contests cache due to deletion");

      return contestId;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete contest";
      return rejectWithValue(errorMessage);
    }
  }
);

const hotOrNotSlice = createSlice({
  name: "hotOrNot",
  initialState,
  reducers: {
    setCurrentContest: (state, action: PayloadAction<HotOrNotContest | null>) => {
      state.currentContest = action.payload;
    },
    updateContestLocal: (state, action: PayloadAction<Partial<HotOrNotContest> & { id: string }>) => {
      if (state.currentContest && state.currentContest.id === action.payload.id) {
        state.currentContest = { ...state.currentContest, ...action.payload };
      }
      const contestIndex = state.contests.findIndex(
        (contest) => contest.id === action.payload.id
      );
      if (contestIndex !== -1) {
        state.contests[contestIndex] = {
          ...state.contests[contestIndex],
          ...action.payload,
        };
      }
      hotOrNotStorage.clearCachedContests(state.mode);
    },
    clearHotOrNotError: (state) => {
      state.error = null;
    },
    clearContests: (state) => {
      state.contests = [];
      state.pagination = initialState.pagination;
      state.lastFetched = null;
      hotOrNotStorage.clearCachedContests(state.mode);
    },
    refreshContests: (state) => {
      state.lastFetched = null;
      hotOrNotStorage.clearCachedContests(state.mode);
    },
    loadContestsFromCache: (state) => {
      const cached = hotOrNotStorage.getCachedContests(state.mode);
      if (cached && hotOrNotStorage.isCacheValid(cached.timestamp)) {
        state.contests = cached.data.data;
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
        console.log("📦 Loaded contests from cache for mode:", state.mode);
      }
    },
    removeContestFromState: (state, action: PayloadAction<string>) => {
      state.contests = state.contests.filter(
        (contest) => contest.id !== action.payload
      );
      if (state.currentContest?.id === action.payload) {
        state.currentContest = null;
      }
    },
    setHotOrNotMode: (state, action: PayloadAction<"admin" | "public">) => {
      state.mode = action.payload;
    },
    switchToAdminMode: (state) => {
      state.mode = "admin";
      state.contests = [];
      state.currentContest = null;
      state.pagination = initialState.pagination;
    },
    switchToPublicMode: (state) => {
      state.mode = "public";
      state.contests = [];
      state.currentContest = null;
      state.pagination = initialState.pagination;
    },
    clearAnalytics: (state) => {
      state.analytics = null;
    },
    clearLeaderboard: (state) => {
      state.leaderboard = [];
    },
    clearNominationCandidates: (state) => {
      state.nominationCandidates = [];
      hotOrNotStorage.clearCachedNominationCandidates();
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin contests
      .addCase(getAdminContests.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.mode = "admin";
      })
      .addCase(getAdminContests.fulfilled, (state, action) => {
        state.loading = false;
        state.contests = action.payload.data;
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
        state.mode = "admin";
        console.log("✅ Admin contests loaded successfully");
      })
      .addCase(getAdminContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ Failed to load admin contests:", action.payload);
      })
      // Public contests
      .addCase(getPublicContests.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.mode = "public";
      })
      .addCase(getPublicContests.fulfilled, (state, action) => {
        state.loading = false;
        state.contests = action.payload.data;
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
        state.mode = "public";
        console.log("✅ Public contests loaded successfully");
      })
      .addCase(getPublicContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ Failed to load public contests:", action.payload);
      })
      // Create contest
      .addCase(createContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContest.fulfilled, (state, action) => {
        state.loading = false;
        state.contests.unshift(action.payload); // Add new contest to the beginning
        state.currentContest = action.payload;
        state.error = null;
      })
      .addCase(createContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update contest
      .addCase(updateContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContest = action.payload;
        const contestIndex = state.contests.findIndex(
          (contest) => contest.id === action.payload.id
        );
        if (contestIndex !== -1) {
          state.contests[contestIndex] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Publish contest
      .addCase(publishContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishContest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContest = action.payload;
        const contestIndex = state.contests.findIndex(
          (contest) => contest.id === action.payload.id
        );
        if (contestIndex !== -1) {
          state.contests[contestIndex] = action.payload;
        }
        state.error = null;
      })
      .addCase(publishContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Assign nominees
      .addCase(assignNominees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignNominees.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // The actual contest data will be updated when we refetch
      })
      .addCase(assignNominees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Nomination candidates
      .addCase(getNominationCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNominationCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.nominationCandidates = action.payload.data;
        state.error = null;
        console.log("✅ Nomination candidates loaded successfully");
      })
      .addCase(getNominationCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ Failed to load nomination candidates:", action.payload);
      })
      // Get contest by ID
      .addCase(getContestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContest = action.payload;
        state.error = null;
      })
      .addCase(getContestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get leaderboard
      .addCase(getLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload;
        state.error = null;
      })
      .addCase(getLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get analytics
      .addCase(getContestAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContestAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
        state.error = null;
      })
      .addCase(getContestAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cast vote
      .addCase(castVote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(castVote.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Leaderboard will be updated on next fetch
      })
      .addCase(castVote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete contest
      .addCase(deleteContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContest.fulfilled, (state, action) => {
        state.loading = false;
        state.contests = state.contests.filter(
          (contest) => contest.id !== action.payload
        );
        if (state.currentContest?.id === action.payload) {
          state.currentContest = null;
        }
        state.error = null;
      })
      .addCase(deleteContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentContest,
  updateContestLocal,
  clearHotOrNotError,
  clearContests,
  refreshContests,
  loadContestsFromCache,
  removeContestFromState,
  setHotOrNotMode,
  switchToAdminMode,
  switchToPublicMode,
  clearAnalytics,
  clearLeaderboard,
  clearNominationCandidates,
} = hotOrNotSlice.actions;

export default hotOrNotSlice.reducer;

// Selectors
export const selectContests = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.contests;
export const selectCurrentContest = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.currentContest;
export const selectNominationCandidates = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.nominationCandidates;
export const selectLeaderboard = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.leaderboard;
export const selectAnalytics = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.analytics;
export const selectHotOrNotLoading = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.loading;
export const selectHotOrNotError = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.error;
export const selectHotOrNotPagination = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.pagination;
export const selectLastFetched = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.lastFetched;
export const selectHotOrNotMode = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.mode;

// Derived selectors
export const selectDraftContests = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.contests.filter((contest) => contest.status === "DRAFT");
export const selectActiveContests = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.contests.filter((contest) => contest.status === "ACTIVE");
export const selectClosedContests = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.contests.filter((contest) => contest.status === "CLOSED");
export const selectFashionContests = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.contests.filter((contest) => contest.theme === "FASHION");
export const selectNightlifeContests = (state: { hotOrNot: HotOrNotState }) =>
  state.hotOrNot.contests.filter((contest) => contest.theme === "NIGHTLIFE");