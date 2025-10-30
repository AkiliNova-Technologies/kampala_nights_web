// hooks/useReduxDJProfile.ts
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  // DJ Profile Actions
  createDJProfile,
  fetchAllDJs,
  fetchPublicDJs,
  fetchDJById,
  fetchDJByUsername,
  fetchCurrentUserDJProfile,
  updateDJProfile,
  updateDJStatus as updateDJStatusAction,
  deleteDJProfile,
  reportDJ as reportDJAction,
  shareDJProfile as shareDJProfileAction,

  // DJ Gig Actions
  createDJGig,
  fetchDJGigs,
  fetchPublicDJGigs,
  fetchTonightGigs,
  fetchDJGigById,
  fetchGigsByDJ,
  fetchPastPlays,
  fetchComingPlays,
  updateDJGig,
  deleteDJGig,

  // Favorite Actions
  addDJToFavorites,
  removeDJFromFavorites,
  fetchUserFavorites,
  fetchDJFavoriteStats,
  checkUserFavorite,

  // Photo Actions
  addDJPhotos,
  fetchDJPhotos,
  deleteDJPhoto,

  // Statistics Actions
  fetchDJStats,
  fetchGigStats,

  // State Management Actions
  clearDJProfile,
  clearDJGigs,
  clearFavorites,
  clearPhotos,
  clearStats,
  clearAll,
  clearError,
  setCurrentDJ,
  setFavoriteStatus,
} from "@/redux/slices/djProfileSlice";
import type {
  DJProfile,
  DJGig,
  DJPhoto,
  CreateDJProfileData,
  UpdateDJProfileData,
  CreateDJGigData,
  UpdateDJGigData,
  UpdateDJStatusData,
  ReportDJData,
  AddPhotoData,
  DJsFilterParams,
  GigsFilterParams,
} from "@/redux/slices/djProfileSlice";
import type { RootState } from "@/redux/store";
import { useCallback } from "react";
import type { Profile, ProfileStats } from "@/types/profile";

export function useReduxDJProfile() {
  const dispatch = useAppDispatch();
  const djProfileState = useAppSelector((state: RootState) => state.djProfile);

  const {
    // DJ Profiles
    allDJs,
    currentDJ,
    djLoading,
    djError,

    // DJ Gigs
    allGigs,
    tonightGigs,
    currentGig,
    gigsLoading,
    gigsError,

    // Favorites
    userFavorites,
    favoriteStats,
    favoritesLoading,
    favoritesError,

    // Photos
    djPhotos,
    photosLoading,
    photosError,

    // Statistics
    djStats,
    gigStats,
    statsLoading,
    statsError,

    // Pagination
    djsPagination,
    gigsPagination,
    favoritesPagination,
    photosPagination,

    // Operations
    creating,
    updating,
    favoriting,
    deleting,
  } = djProfileState;

  // ========== DJ PROFILE ACTIONS ==========

  const createDJ = useCallback(
    (data: CreateDJProfileData) => {
      return dispatch(createDJProfile(data));
    },
    [dispatch]
  );

  const getAllDJs = useCallback(
    (params: DJsFilterParams = {}) => {
      return dispatch(fetchAllDJs(params));
    },
    [dispatch]
  );

  const getPublicDJs = useCallback(
    (params: DJsFilterParams = {}) => {
      return dispatch(fetchPublicDJs(params));
    },
    [dispatch]
  );

  const getDJById = useCallback(
    (id: string) => {
      return dispatch(fetchDJById(id));
    },
    [dispatch]
  );

  const getDJByUsername = useCallback(
    (username: string) => {
      return dispatch(fetchDJByUsername(username));
    },
    [dispatch]
  );

  const getCurrentUserDJProfile = useCallback(() => {
    return dispatch(fetchCurrentUserDJProfile());
  }, [dispatch]);

  const updateDJ = useCallback(
    (id: string, data: UpdateDJProfileData) => {
      return dispatch(updateDJProfile({ id, data }));
    },
    [dispatch]
  );

  const updateDJStatus = useCallback(
    (djId: string, status: UpdateDJStatusData) => {
      return dispatch(updateDJStatusAction({ djId, status }));
    },
    [dispatch]
  );

  const deleteDJ = useCallback(
    (id: string) => {
      return dispatch(deleteDJProfile(id));
    },
    [dispatch]
  );

  const reportDJ = useCallback(
    (djId: string, data: ReportDJData) => {
      return dispatch(reportDJAction({ djId, data }));
    },
    [dispatch]
  );

  const shareDJProfile = useCallback(
    (djId: string) => {
      return dispatch(shareDJProfileAction(djId));
    },
    [dispatch]
  );

  // ========== DJ GIG ACTIONS ==========

  const createGig = useCallback(
    (data: CreateDJGigData) => {
      return dispatch(createDJGig(data));
    },
    [dispatch]
  );

  const getDJGigs = useCallback(
    (params: GigsFilterParams = {}) => {
      return dispatch(fetchDJGigs(params));
    },
    [dispatch]
  );

  const getPublicDJGigs = useCallback(
    (params: GigsFilterParams = {}) => {
      return dispatch(fetchPublicDJGigs(params));
    },
    [dispatch]
  );

  const getTonightGigs = useCallback(
    (params: GigsFilterParams = {}) => {
      return dispatch(fetchTonightGigs(params));
    },
    [dispatch]
  );

  const getDJGigById = useCallback(
    (gigId: string) => {
      return dispatch(fetchDJGigById(gigId));
    },
    [dispatch]
  );

  const getGigsByDJId = useCallback(
    (djId: string) => {
      return dispatch(fetchGigsByDJ(djId));
    },
    [dispatch]
  );

  const getPastPlays = useCallback(
    (djId: string) => {
      return dispatch(fetchPastPlays(djId));
    },
    [dispatch]
  );

  const getComingPlays = useCallback(
    (djId: string) => {
      return dispatch(fetchComingPlays(djId));
    },
    [dispatch]
  );

  const updateGig = useCallback(
    (gigId: string, data: UpdateDJGigData) => {
      return dispatch(updateDJGig({ gigId, data }));
    },
    [dispatch]
  );

  const deleteGig = useCallback(
    (gigId: string) => {
      return dispatch(deleteDJGig(gigId));
    },
    [dispatch]
  );

  // ========== FAVORITE ACTIONS ==========

  const addFavorite = useCallback(
    (djId: string) => {
      return dispatch(addDJToFavorites(djId));
    },
    [dispatch]
  );

  const removeFavorite = useCallback(
    (djId: string) => {
      return dispatch(removeDJFromFavorites(djId));
    },
    [dispatch]
  );

  const getUserFavorites = useCallback(
    (params: DJsFilterParams = {}) => {
      return dispatch(fetchUserFavorites(params));
    },
    [dispatch]
  );

  const getDJFavoriteStats = useCallback(
    (djId: string) => {
      return dispatch(fetchDJFavoriteStats(djId));
    },
    [dispatch]
  );

  const checkFavorite = useCallback(
    (djId: string) => {
      return dispatch(checkUserFavorite(djId));
    },
    [dispatch]
  );

  // ========== PHOTO ACTIONS ==========

  const addPhotos = useCallback(
    (djId: string, data: AddPhotoData[]) => {
      return dispatch(addDJPhotos({ djId, data }));
    },
    [dispatch]
  );

  const getDJPhotos = useCallback(
    (djId: string) => {
      return dispatch(fetchDJPhotos(djId));
    },
    [dispatch]
  );

  const deletePhoto = useCallback(
    (djId: string, photoId: string) => {
      return dispatch(deleteDJPhoto({ djId, photoId }));
    },
    [dispatch]
  );

  // ========== STATISTICS ACTIONS ==========

  const getDJStats = useCallback(() => {
    return dispatch(fetchDJStats());
  }, [dispatch]);

  const getGigStats = useCallback(() => {
    return dispatch(fetchGigStats());
  }, [dispatch]);

  // ========== STATE MANAGEMENT ACTIONS ==========

  const clearCurrentDJ = useCallback(() => {
    dispatch(clearDJProfile());
  }, [dispatch]);

  const clearGigs = useCallback(() => {
    dispatch(clearDJGigs());
  }, [dispatch]);

  const clearUserFavorites = useCallback(() => {
    dispatch(clearFavorites());
  }, [dispatch]);

  const clearDJPhotos = useCallback(() => {
    dispatch(clearPhotos());
  }, [dispatch]);

  const clearStatistics = useCallback(() => {
    dispatch(clearStats());
  }, [dispatch]);

  const clearAllData = useCallback(() => {
    dispatch(clearAll());
  }, [dispatch]);

  const clearAllErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setDJ = useCallback(
    (profile: DJProfile) => {
      dispatch(setCurrentDJ(profile));
    },
    [dispatch]
  );

  const setFavorite = useCallback(
    (djId: string, isFavorited: boolean) => {
      dispatch(setFavoriteStatus({ djId, isFavorited }));
    },
    [dispatch]
  );

  // ========== COMPUTED PROPERTIES ==========

  const hasDJs = allDJs.length > 0;
  const hasTonightGigs = tonightGigs.length > 0;
  const hasUserFavorites = userFavorites.length > 0;
  const hasPhotos = djPhotos.length > 0;
  const isDJEnabled = currentDJ?.status === "ENABLED";
  const isDJPending = currentDJ?.status === "PENDING";
  const isDJDisabled = currentDJ?.status === "DISABLED";

  // Get favorite status for a specific DJ
  const getFavoriteStatus = useCallback(
    (djId: string): boolean => {
      return favoriteStats[djId]?.isFavorited || false;
    },
    [favoriteStats]
  );

  // Get favorite count for a specific DJ
  const getFavoriteCount = useCallback(
    (djId: string): number => {
      return favoriteStats[djId]?.totalFavorites || 0;
    },
    [favoriteStats]
  );

  // Check if user has favorited a specific DJ
  const hasUserFavoritedDJ = useCallback(
    (djId: string): boolean => {
      return userFavorites.some((fav) => fav.djId === djId);
    },
    [userFavorites]
  );

  // Get DJs by genre
  const getDJsByGenre = useCallback(
    (genre: string): DJProfile[] => {
      return allDJs.filter((dj) =>
        dj.genre.toLowerCase().includes(genre.toLowerCase())
      );
    },
    [allDJs]
  );

  // Get gigs by DJ
  const getGigsByDJ = useCallback(
    (djId: string): DJGig[] => {
      return allGigs.filter((gig) => gig.djId === djId);
    },
    [allGigs]
  );

  // Get photos by DJ
  const getPhotosByDJ = useCallback(
    (djId: string): DJPhoto[] => {
      return djPhotos.filter((photo) => photo.djId === djId);
    },
    [djPhotos]
  );

  // ========== COMPATIBILITY FUNCTIONS ==========

  // Convert DJProfile to your Profile type for compatibility
  const convertToProfile = useCallback((djProfile: DJProfile): Profile => {
    return {
      id: djProfile.id,
      name: djProfile.fullName,
      username: djProfile.djUsername,
      email: djProfile.email,
      phone: djProfile.phone,
      genre: djProfile.genre,
      bio: djProfile.bio,
      experience: djProfile.experience,
      equipment: djProfile.equipment,
      status: mapDJStatusToProfileStatus(djProfile.status),
      visibility: "public",
      location: djProfile.location || "",
      city: djProfile.city,
      country: djProfile.country,
      socialProfiles: Array.isArray(djProfile.socials)
        ? djProfile.socials.reduce((acc, social) => {
            acc[social.platform] = social.url;
            return acc;
          }, {} as any)
        : undefined,
      eventsPlayed: djProfile.eventsPlayed || 0,
      rating: djProfile.rating || 0,
      followers: djProfile.favoriteCount,
      totalPlays: 0,
      profileImage: djProfile.profileImageUrl,
      backgroundImage: djProfile.backgroundImageUrl,
      performanceTypes: djProfile.performanceTypes,
      venuesPlayed: djProfile.venuesPlayed,
      availability: djProfile.availability,
      createdAt: djProfile.createdAt,
      updatedAt: djProfile.updatedAt || djProfile.createdAt,
      lastActive: djProfile.updatedAt || djProfile.createdAt,
    };
  }, []);

  // Get profiles in your existing format
  const profiles: Profile[] = allDJs.map(convertToProfile);

  // Get current profile in your existing format
  const currentProfile: Profile | null = currentDJ
    ? convertToProfile(currentDJ)
    : null;

  // Get statistics for your dashboard (compatibility with existing getStatistics)
  const getStatistics = useCallback((): ProfileStats => {
    // Use API stats if available, otherwise calculate from local state
    if (djStats) {
      return {
        total: djStats.total,
        active: djStats.active,
        disabled: djStats.disabled,
        drafts: djStats.drafts,
        averageRating: djStats.averageRating,
        totalFollowers: djStats.totalFollowers,
        totalEvents: gigStats?.total || 0,
      };
    }

    // Fallback to local state calculation
    const total = allDJs.length;
    const active = allDJs.filter((dj) => dj.status === "ENABLED").length;
    const disabled = allDJs.filter((dj) => dj.status === "DISABLED").length;
    const drafts = allDJs.filter((dj) => dj.status === "PENDING").length;
    const totalFollowers = allDJs.reduce(
      (sum, dj) => sum + dj.favoriteCount,
      0
    );
    const totalEvents = allGigs.length;

    return {
      total,
      active,
      disabled,
      drafts,
      averageRating: 0,
      totalFollowers,
      totalEvents,
    };
  }, [allDJs, allGigs, djStats, gigStats]);

  // Search and filter profiles (compatible with your existing filters)
  const searchProfiles = useCallback(
    (
      query: string,
      filters?: {
        status?: string[];
        genre?: string[];
        location?: string;
      }
    ): Profile[] => {
      return allDJs
        .filter((dj) => {
          const matchesSearch =
            dj.fullName.toLowerCase().includes(query.toLowerCase()) ||
            dj.djUsername.toLowerCase().includes(query.toLowerCase()) ||
            dj.genre.toLowerCase().includes(query.toLowerCase()) ||
            dj.location?.toLowerCase().includes(query.toLowerCase());

          const matchesStatus =
            !filters?.status ||
            filters.status.length === 0 ||
            filters.status.includes(dj.status.toLowerCase());

          const matchesGenre =
            !filters?.genre ||
            filters.genre.length === 0 ||
            filters.genre.some((genre) =>
              dj.genre.toLowerCase().includes(genre.toLowerCase())
            );

          const matchesLocation =
            !filters?.location ||
            filters.location === "" ||
            dj.location?.toLowerCase().includes(filters.location.toLowerCase());

          return matchesSearch && matchesStatus && matchesGenre && matchesLocation;
        })
        .map(convertToProfile);
    },
    [allDJs, convertToProfile]
  );

  return {
    // ========== STATE ==========
    
    // DJ Profiles
    allDJs,
    currentDJ,
    djLoading,
    djError,

    // DJ Gigs
    allGigs,
    tonightGigs,
    currentGig,
    gigsLoading,
    gigsError,

    // Favorites
    userFavorites,
    favoriteStats,
    favoritesLoading,
    favoritesError,

    // Photos
    djPhotos,
    photosLoading,
    photosError,

    // Statistics
    djStats,
    gigStats,
    statsLoading,
    statsError,

    // Pagination
    djsPagination,
    gigsPagination,
    favoritesPagination,
    photosPagination,

    // Operations
    creating,
    updating,
    favoriting,
    deleting,

    // State (Compatible with your existing components)
    profiles,
    currentProfile,

    // ========== COMPUTED PROPERTIES ==========
    hasDJs,
    hasTonightGigs,
    hasUserFavorites,
    hasPhotos,
    isDJEnabled,
    isDJPending,
    isDJDisabled,

    // ========== DJ PROFILE ACTIONS ==========
    createDJ,
    getAllDJs,
    getPublicDJs,
    getDJById,
    getDJByUsername,
    getCurrentUserDJProfile,
    updateDJ,
    updateDJStatus,
    deleteDJ,
    reportDJ,
    shareDJProfile,

    // ========== DJ GIG ACTIONS ==========
    createGig,
    getDJGigs,
    getPublicDJGigs,
    getTonightGigs,
    getDJGigById,
    getGigsByDJId,
    getPastPlays,
    getComingPlays,
    updateGig,
    deleteGig,

    // ========== FAVORITE ACTIONS ==========
    addFavorite,
    removeFavorite,
    getUserFavorites,
    getDJFavoriteStats,
    checkFavorite,

    // ========== PHOTO ACTIONS ==========
    addPhotos,
    getDJPhotos,
    deletePhoto,

    // ========== STATISTICS ACTIONS ==========
    getDJStats,
    getGigStats,

    // ========== STATE MANAGEMENT ACTIONS ==========
    clearCurrentDJ,
    clearGigs,
    clearUserFavorites,
    clearDJPhotos,
    clearStatistics,
    clearAllData,
    clearAllErrors,
    setCurrentDJ: setDJ,
    setFavoriteStatus: setFavorite,

    // ========== HELPER FUNCTIONS ==========
    getFavoriteStatus,
    getFavoriteCount,
    hasUserFavoritedDJ,
    getDJsByGenre,
    getGigsByDJ,
    getPhotosByDJ,

    // ========== COMPATIBILITY FUNCTIONS ==========
    getStatistics,
    searchProfiles,
    convertToProfile,
  };
}

// Export standalone conversion functions
export const convertDJProfileToProfile = (djProfile: DJProfile): Profile => {
  return {
    id: djProfile.id,
    name: djProfile.fullName,
    username: djProfile.djUsername,
    email: djProfile.email,
    phone: djProfile.phone,
    genre: djProfile.genre,
    bio: djProfile.bio,
    experience: djProfile.experience,
    equipment: djProfile.equipment,
    status: mapDJStatusToProfileStatus(djProfile.status),
    visibility: "public",
    location: djProfile.location || "",
    city: djProfile.city,
    country: djProfile.country,
    socialProfiles: djProfile.socials.reduce((acc, social) => {
      acc[social.platform] = social.url;
      return acc;
    }, {} as any),
    eventsPlayed: djProfile.eventsPlayed || 0,
    rating: djProfile.rating || 0,
    followers: djProfile.favoriteCount,
    totalPlays: 0,
    profileImage: djProfile.profileImageUrl,
    backgroundImage: djProfile.backgroundImageUrl,
    performanceTypes: djProfile.performanceTypes,
    venuesPlayed: djProfile.venuesPlayed,
    availability: djProfile.availability,
    createdAt: djProfile.createdAt,
    updatedAt: djProfile.updatedAt || djProfile.createdAt,
    lastActive: djProfile.updatedAt || djProfile.createdAt,
  };
};

const mapDJStatusToProfileStatus = (
  status: DJProfile["status"]
): Profile["status"] => {
  const statusMap = {
    ENABLED: "active",
    DISABLED: "disabled",
    PENDING: "draft",
  };
  return statusMap[status] as Profile["status"];
};

export type UseReduxDJProfileReturn = ReturnType<typeof useReduxDJProfile>;