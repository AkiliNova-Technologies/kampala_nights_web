import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getBusinesses,
  getBusinessById,
  updateBusiness,
  updateBusinessStatus,
  setCurrentBusiness,
  updateBusinessLocal,
  clearBusinessError,
  clearBusinesses,
  refreshBusinesses,
  loadBusinessesFromCache,
} from "@/redux/slices/businessSlice";
import type {
  BusinessUser,
  BusinessAccount,
} from "@/redux/slices/businessSlice";
import type { RootState } from "@/redux/store";
import { useCallback, useEffect, useRef } from "react";

export function useReduxBusiness() {
  const dispatch = useAppDispatch();
  const businessState = useAppSelector((state: RootState) => state.business);
  const hasInitialized = useRef(false);

  const {
    businesses = [],
    currentBusiness = null,
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
  } = businessState;

  useEffect(() => {
    if (!hasInitialized.current) {
      console.log("🔄 Loading businesses from cache...");
      dispatch(loadBusinessesFromCache());
      hasInitialized.current = true;
    }
  }, [dispatch]);

  // Actions - Use consistent naming
  const fetchBusinesses = useCallback(
    (params?: {
      page?: number;
      limit?: number;
      forceRefresh?: boolean;
      background?: boolean;
    }) => {
      console.log("📦 Fetching businesses with params:", params);
      return dispatch(getBusinesses(params || {}));
    },
    [dispatch]
  );

  const fetchBusinessById = useCallback(
    (businessId: string) => dispatch(getBusinessById(businessId)),
    [dispatch]
  );

  const updateBusinessData = useCallback(
    (id: string, businessData: Partial<BusinessAccount>) =>
      dispatch(updateBusiness({ id, businessData })),
    [dispatch]
  );

  // FIX: Rename to avoid naming conflict with imported function
  const updateBusinessStatusAction = useCallback(
    (id: string, action: string, notes?: string) =>
      dispatch(updateBusinessStatus({ id, action, notes })),
    [dispatch]
  );

  const setCurrentBusinessData = useCallback(
    (business: BusinessUser | null) => dispatch(setCurrentBusiness(business)),
    [dispatch]
  );

  const updateBusinessLocally = useCallback(
    (businessData: Partial<BusinessUser>) =>
      dispatch(updateBusinessLocal(businessData)),
    [dispatch]
  );

  const clearBusinessErrorState = useCallback(
    () => dispatch(clearBusinessError()),
    [dispatch]
  );

  const clearBusinessesData = useCallback(
    () => dispatch(clearBusinesses()),
    [dispatch]
  );

  const refreshBusinessesData = useCallback(
    () => dispatch(refreshBusinesses()),
    [dispatch]
  );

  return {
    // State
    businesses,
    currentBusiness,
    loading,
    error,
    pagination,
    lastFetched,

    // Actions
    getBusinesses: fetchBusinesses,
    fetchBusinesses,
    fetchBusinessById,
    updateBusinessData,
    updateBusinessStatus: updateBusinessStatusAction,
    setCurrentBusiness: setCurrentBusinessData,
    updateBusinessLocal: updateBusinessLocally,
    clearError: clearBusinessErrorState,
    clearBusinesses: clearBusinessesData,
    refreshBusinesses: refreshBusinessesData,
    hasData: businesses.length > 0,
  };
}