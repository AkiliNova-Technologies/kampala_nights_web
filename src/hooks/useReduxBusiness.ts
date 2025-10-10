import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  getBusinesses, 
  getBusinessById, 
  updateBusiness, 
  setCurrentBusiness, 
  updateBusinessLocal, 
  clearBusinessError, 
  clearBusinesses,
  refreshBusinesses,
  loadBusinessesFromCache,
} from '@/redux/slices/businessSlice';
import type { BusinessUser, BusinessAccount } from '@/redux/slices/businessSlice';
import type { RootState } from '@/redux/store';
import { useCallback, useEffect } from 'react';

export function useReduxBusiness() {
  const dispatch = useAppDispatch();
  const businessState = useAppSelector((state: RootState) => state.business);

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
    dispatch(loadBusinessesFromCache());
  }, [dispatch]);

  // Actions - Use consistent naming
  const fetchBusinesses = useCallback((params?: { page?: number; limit?: number; forceRefresh?: boolean }) => 
    dispatch(getBusinesses(params || {})), [dispatch]);

  const fetchBusinessById = useCallback((businessId: string) => 
    dispatch(getBusinessById(businessId)), [dispatch]);

  const updateBusinessData = useCallback((id: string, businessData: Partial<BusinessAccount>) => 
    dispatch(updateBusiness({ id, businessData })), [dispatch]);

  const setCurrentBusinessData = useCallback((business: BusinessUser | null) => 
    dispatch(setCurrentBusiness(business)), [dispatch]);

  const updateBusinessLocally = useCallback((businessData: Partial<BusinessUser>) => 
    dispatch(updateBusinessLocal(businessData)), [dispatch]);

  const clearBusinessErrorState = useCallback(() => 
    dispatch(clearBusinessError()), [dispatch]);

  const clearBusinessesData = useCallback(() => 
    dispatch(clearBusinesses()), [dispatch]);

  const refreshBusinessesData = useCallback(() => 
    dispatch(refreshBusinesses()), [dispatch]);

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
    setCurrentBusiness: setCurrentBusinessData,
    updateBusinessLocal: updateBusinessLocally,
    clearError: clearBusinessErrorState,
    clearBusinesses: clearBusinessesData,
    refreshBusinesses: refreshBusinessesData,
  };
}