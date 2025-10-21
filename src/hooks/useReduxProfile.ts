import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchUserProfile,
  fetchBusinessProfile,
  updateLocationAmenities,
  updateCompanyDetails,
  changePassword,
  clearProfile,
  clearError,
  setBusinessProfile,
  setUserProfile,
} from "@/redux/slices/profileSlice";
import type {
  UserProfile,
  BusinessProfile,
  LocationAmenitiesData,
  CompanyDetailsData,
  PasswordChangeData,
} from "@/redux/slices/profileSlice";
import type { RootState } from "@/redux/store";
import { useCallback } from "react";

export function useReduxProfile() {
  const dispatch = useAppDispatch();
  const profileState = useAppSelector((state: RootState) => state.profile);

  const {
    userProfile,
    businessProfile,
    loading,
    error,
    updating,
    updateError,
  } = profileState;

  // Fetch user profile
  const getUserProfile = useCallback(() => {
    return dispatch(fetchUserProfile());
  }, [dispatch]);

  // Fetch business profile
  const getBusinessProfile = useCallback(() => {
    return dispatch(fetchBusinessProfile());
  }, [dispatch]);

  // Update location and amenities
  const updateLocationAndAmenities = useCallback(
    (data: LocationAmenitiesData) => {
      return dispatch(updateLocationAmenities(data));
    },
    [dispatch]
  );

  // Update company details
  const updateCompanyDetailsData = useCallback(
    (data: CompanyDetailsData) => {
      return dispatch(updateCompanyDetails(data));
    },
    [dispatch]
  );

  // Change password
  const changeUserPassword = useCallback(
    (data: PasswordChangeData) => {
      return dispatch(changePassword(data));
    },
    [dispatch]
  );

  // Clear all profile data
  const clearProfileData = useCallback(() => {
    dispatch(clearProfile());
  }, [dispatch]);

  // Clear errors
  const clearProfileError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Set business profile locally (for optimistic updates)
  const setBusinessProfileData = useCallback(
    (profile: BusinessProfile) => {
      dispatch(setBusinessProfile(profile));
    },
    [dispatch]
  );

  // Set user profile locally (for optimistic updates)
  const setUserProfileData = useCallback(
    (profile: UserProfile) => {
      dispatch(setUserProfile(profile));
    },
    [dispatch]
  );

  // Check if user has a business profile
  const hasBusinessProfile = !!businessProfile;

  // Check if business profile is completed
  const isProfileCompleted = businessProfile?.profileCompleted || false;

  // Check if business is verified
  const isBusinessVerified = businessProfile?.isVerified || false;

  // Get complete profile data
  const completeProfile = {
    user: userProfile,
    business: businessProfile,
  };

  return {
    // State
    userProfile,
    businessProfile,
    completeProfile,
    loading,
    error,
    updating,
    updateError,

    // Computed properties
    hasBusinessProfile,
    isProfileCompleted,
    isBusinessVerified,

    // Actions
    getUserProfile,
    getBusinessProfile,
    updateLocationAndAmenities,
    updateCompanyDetails: updateCompanyDetailsData,
    changePassword: changeUserPassword,
    clearProfile: clearProfileData,
    clearError: clearProfileError,
    setBusinessProfile: setBusinessProfileData,
    setUserProfile: setUserProfileData,
  };
}