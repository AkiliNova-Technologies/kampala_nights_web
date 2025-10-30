import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getAdminContests,
  getPublicContests,
  createContest,
  assignNominees,
  getNominationCandidates,
  getContestById,
  getLeaderboard,
  getContestAnalytics,
  castVote,
  deleteContest,
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
} from "@/redux/slices/hotOrNotSlice";
import type {
  CreateContestData,
  VoteData,
} from "@/redux/slices/hotOrNotSlice";
import type { RootState } from "@/redux/store";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { HotOrNotContest } from "@/types/hot-or-not";

interface UseReduxHotOrNotOptions {
  mode?: "admin" | "public";
  autoLoad?: boolean;
  theme?: "FASHION" | "NIGHTLIFE"; // Add theme filtering
}

export function useReduxHotOrNot(options: UseReduxHotOrNotOptions = {}) {
  const { mode = "admin", autoLoad = true, theme } = options;

  const dispatch = useAppDispatch();
  const hotOrNotState = useAppSelector((state: RootState) => state.hotOrNot);
  const hasInitialized = useRef(false);

  const {
    contests = [],
    currentContest = null,
    nominationCandidates = [],
    leaderboard = [],
    analytics = null,
    loading = false,
    error = null,
    pagination = {
      page: 0,
      limit: 0,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
    lastFetched = null,
    mode: currentMode,
  } = hotOrNotState;

  // Set mode on mount and when mode prop changes
  useEffect(() => {
    if (currentMode !== mode) {
      dispatch(setHotOrNotMode(mode));
    }
  }, [dispatch, mode, currentMode]);

  useEffect(() => {
    if (autoLoad && !hasInitialized.current) {
      console.log(`🔄 Loading ${mode} contests from cache...`);
      dispatch(loadContestsFromCache());
      hasInitialized.current = true;
    }
  }, [dispatch, mode, autoLoad]);

  // Filter contests by theme if specified
  const filteredContests = useMemo(() => {
    if (!theme) return contests;
    return contests.filter(contest => contest.theme === theme);
  }, [contests, theme]);

  // Filter nomination candidates by theme if specified
  const filteredNominationCandidates = useMemo(() => {
    if (!theme) return nominationCandidates;
    return nominationCandidates; // The API should handle theme filtering for nomination candidates
  }, [nominationCandidates, theme]);

  // Admin contests with theme filtering
  const fetchAdminContests = useCallback(
    (params?: {
      page?: number;
      limit?: number;
      forceRefresh?: boolean;
      theme?: string;
      status?: string;
    }) => {
      console.log("📦 Fetching admin contests with params:", params);
      // Always include the theme from hook options if not overridden
      const finalParams = {
        ...params,
        theme: params?.theme || theme,
      };
      return dispatch(getAdminContests(finalParams));
    },
    [dispatch, theme]
  );

  // Public contests with theme filtering
  const fetchPublicContests = useCallback(
    (params?: {
      page?: number;
      limit?: number;
      forceRefresh?: boolean;
    }) => {
      console.log("📦 Fetching public contests with params:", params);
      // Always include the theme from hook options
      const finalParams = {
        ...params,
        theme: theme, // Pass theme to public contests if needed
      };
      return dispatch(getPublicContests(finalParams));
    },
    [dispatch, theme]
  );

  // Get nomination candidates with theme filtering
  const fetchNominationCandidates = useCallback(
    (params?: {
      page?: number;
      limit?: number;
      forceRefresh?: boolean;
      theme?: string;
    }) => {
      console.log("📦 Fetching nomination candidates with params:", params);
      // Always include the theme from hook options if not overridden
      const finalParams = {
        ...params,
        theme: params?.theme || theme,
      };
      return dispatch(getNominationCandidates(finalParams));
    },
    [dispatch, theme]
  );

  // Create contest
  const createNewContest = useCallback(
    (contestData: CreateContestData) => dispatch(createContest(contestData)),
    [dispatch]
  );

  // Assign nominees
  const assignNomineesToContest = useCallback(
    (contestId: string, nomineeData: { postIds: string[] }) =>
      dispatch(assignNominees({ contestId, nomineeData })),
    [dispatch]
  );

  const fetchContestAnalytics = useCallback(
    (contestId: string) => dispatch(getContestAnalytics(contestId)),
    [dispatch]
  );

  const deleteContestById = useCallback(
    (contestId: string) => dispatch(deleteContest(contestId)),
    [dispatch]
  );

  // Common actions (work for both modes)
  const fetchContestById = useCallback(
    (contestId: string) => dispatch(getContestById(contestId)),
    [dispatch]
  );

  const fetchContestLeaderboard = useCallback(
    (contestId: string) => dispatch(getLeaderboard(contestId)),
    [dispatch]
  );

  const castVoteForContestant = useCallback(
    (voteData: VoteData) => dispatch(castVote(voteData)),
    [dispatch]
  );

  // Mode switching
  const switchToAdmin = useCallback(
    () => dispatch(switchToAdminMode()),
    [dispatch]
  );

  const switchToPublic = useCallback(
    () => dispatch(switchToPublicMode()),
    [dispatch]
  );

  // Local state actions
  const setCurrentContestData = useCallback(
    (contest: HotOrNotContest | null) => dispatch(setCurrentContest(contest)),
    [dispatch]
  );

  const updateContestLocally = useCallback(
    (contestData: Partial<HotOrNotContest> & { id: string }) =>
      dispatch(updateContestLocal(contestData)),
    [dispatch]
  );

  const clearErrorState = useCallback(
    () => dispatch(clearHotOrNotError()),
    [dispatch]
  );

  const clearContestsData = useCallback(
    () => dispatch(clearContests()),
    [dispatch]
  );

  const refreshContestsData = useCallback(
    () => dispatch(refreshContests()),
    [dispatch]
  );

  const removeContestFromLocalState = useCallback(
    (contestId: string) => dispatch(removeContestFromState(contestId)),
    [dispatch]
  );

  const clearAnalyticsData = useCallback(
    () => dispatch(clearAnalytics()),
    [dispatch]
  );

  const clearLeaderboardData = useCallback(
    () => dispatch(clearLeaderboard()),
    [dispatch]
  );

  const clearNominationCandidatesData = useCallback(
    () => dispatch(clearNominationCandidates()),
    [dispatch]
  );

  // Smart fetch that uses current mode
  const fetchContests = useCallback(
    (params?: {
      page?: number;
      limit?: number;
      forceRefresh?: boolean;
      theme?: string;
      status?: string;
    }) => {
      if (currentMode === "public") {
        return fetchPublicContests(params);
      }
      return fetchAdminContests(params);
    },
    [currentMode, fetchPublicContests, fetchAdminContests]
  );

  // Derived state from filtered contests
  const draftContests = filteredContests.filter((contest) => contest.status === "DRAFT");
  const activeContests = filteredContests.filter((contest) => contest.status === "ACTIVE");
  const closedContests = filteredContests.filter((contest) => contest.status === "CLOSED");
  const fashionContests = filteredContests.filter((contest) => contest.theme === "FASHION");
  const nightlifeContests = filteredContests.filter((contest) => contest.theme === "NIGHTLIFE");

  // Status flags based on filtered data
  const hasData = filteredContests.length > 0;
  const hasDraftContests = draftContests.length > 0;
  const hasActiveContests = activeContests.length > 0;
  const hasClosedContests = closedContests.length > 0;
  const hasNominationCandidates = filteredNominationCandidates.length > 0;
  const hasLeaderboard = leaderboard.length > 0;
  const hasAnalytics = analytics !== null;
  const isAdminMode = currentMode === "admin";
  const isPublicMode = currentMode === "public";

  // Convenience methods for common operations
  const nominateToContest = useCallback(
    async (contestId: string, postIds: string[]) => {
      const result = await assignNomineesToContest(contestId, { postIds });
      // Refresh nomination candidates after nominating
      dispatch(clearNominationCandidates());
      return result;
    },
    [assignNomineesToContest, dispatch]
  );

  const getContestWithLeaderboard = useCallback(
    async (contestId: string) => {
      const contestResult = await fetchContestById(contestId);
      // Check if the fetch was successful (basic check)
      if (contestResult) {
        await fetchContestLeaderboard(contestId);
      }
      return contestResult;
    },
    [fetchContestById, fetchContestLeaderboard]
  );

  const refreshAllData = useCallback(() => {
    dispatch(refreshContests());
    dispatch(clearNominationCandidates());
    dispatch(clearLeaderboard());
    dispatch(clearAnalytics());
  }, [dispatch]);

  return {
    // State - return filtered data
    contests: filteredContests,
    nominationCandidates: filteredNominationCandidates,
    currentContest,
    leaderboard,
    analytics,
    loading,
    error,
    pagination,
    lastFetched,
    mode: currentMode,

    // Filtered contests
    draftContests,
    activeContests,
    closedContests,
    fashionContests,
    nightlifeContests,

    // Actions with theme support
    fetchAdminContests,
    fetchPublicContests,
    fetchNominationCandidates,
    fetchContestAnalytics,
    deleteContest: deleteContestById,

    // Contest management actions
    createContest: createNewContest,
    assignNominees: assignNomineesToContest,

    // Common actions (auto-detect mode)
    getContests: fetchContests,
    fetchContests,
    fetchContestById,
    fetchLeaderboard: fetchContestLeaderboard,
    castVote: castVoteForContestant,

    // Mode management
    switchToAdmin,
    switchToPublic,
    setHotOrNotMode: (mode: "admin" | "public") => dispatch(setHotOrNotMode(mode)),

    // Local state actions
    setCurrentContest: setCurrentContestData,
    updateContestLocal: updateContestLocally,
    clearError: clearErrorState,
    clearContests: clearContestsData,
    refreshContests: refreshContestsData,
    removeContestFromState: removeContestFromLocalState,
    clearAnalytics: clearAnalyticsData,
    clearLeaderboard: clearLeaderboardData,
    clearNominationCandidates: clearNominationCandidatesData,

    // Status flags
    hasData,
    hasDraftContests,
    hasActiveContests,
    hasClosedContests,
    hasNominationCandidates,
    hasLeaderboard,
    hasAnalytics,
    isAdminMode,
    isPublicMode,

    // Convenience methods
    nominateToContest,
    getContestWithLeaderboard,
    refreshAllData,
  };
}

// Export the hook type for better TypeScript support
export type UseReduxHotOrNotReturn = ReturnType<typeof useReduxHotOrNot>;