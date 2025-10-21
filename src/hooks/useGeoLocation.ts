// hooks/useGeoLocation.ts
import { useState, useEffect, useCallback } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  fullAddress?: string; 
  // accuracy?: number;
  // timestamp?: number;
}

export interface Address {
  // street?: string;
  // city?: string;
  // district?: string;
  // state?: string;
  // country?: string;
  // postalCode?: string;
  fullAddress?: string;
  // neighborhood?: string;
}

interface UseGeoLocationProps {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  enableReverseGeocoding?: boolean;
  onSuccess?: (location: Location, address?: Address) => void;
  onError?: (error: GeolocationPositionError) => void;
}

interface UseGeoLocationReturn {
  location: Location | null;
  address: Address | null;
  loading: boolean;
  error: string | null;
  getLocation: () => void;
  startTracking: () => void;
  stopTracking: () => void;
  isSupported: boolean;
}

export function useGeoLocation({
  enableHighAccuracy = true,
  timeout = 10000,
  maximumAge = 300000,
  enableReverseGeocoding = true,
  onSuccess,
  onError,
}: UseGeoLocationProps = {}): UseGeoLocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const isSupported = typeof window !== 'undefined' && 'geolocation' in navigator;

  // Reverse geocoding function
  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<Address> => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }
      
      const data = await response.json();
      
      // const addressComponents = data.address;
      
      return {
        // street: addressComponents.road || addressComponents.pedestrian,
        // city: addressComponents.city || addressComponents.town || addressComponents.village,
        // district: addressComponents.suburb || addressComponents.city_district,
        // state: addressComponents.state,
        // country: addressComponents.country,
        // postalCode: addressComponents.postcode,
        // neighborhood: addressComponents.neighbourhood,
        fullAddress: data.display_name,
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      
      // Fallback: Try BigDataCloud API
      try {
        const fallbackResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        );
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          return {
            // city: fallbackData.city,
            // state: fallbackData.principalSubdivision,
            // country: fallbackData.countryName,
            // postalCode: fallbackData.postcode,
            fullAddress: fallbackData.locality,
          };
        }
      } catch (fallbackError) {
        console.error('Fallback reverse geocoding also failed:', fallbackError);
      }
      
      return {};
    }
  }, []);

  const handleSuccess = useCallback(async (position: GeolocationPosition) => {
    const newLocation: Location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      // accuracy: position.coords.accuracy,
      // timestamp: position.timestamp,
    };

    setLocation(newLocation);
    setError(null);

    let addressData: Address | null = null;
    
    if (enableReverseGeocoding) {
      try {
        addressData = await reverseGeocode(newLocation.latitude, newLocation.longitude);
        setAddress(addressData);
        
        // Update location with fullAddress
        if (addressData.fullAddress) {
          const locationWithAddress: Location = {
            ...newLocation,
            fullAddress: addressData.fullAddress
          };
          setLocation(locationWithAddress);
          newLocation.fullAddress = addressData.fullAddress;
        }
      } catch (geocodeError) {
        console.error('Reverse geocoding failed:', geocodeError);
      }
    }

    setLoading(false);
    onSuccess?.(newLocation, addressData || undefined);
  }, [enableReverseGeocoding, reverseGeocode, onSuccess]);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Unknown error occurred';

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied by user';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
      default:
        errorMessage = 'An unknown error occurred';
        break;
    }

    setError(errorMessage);
    setLoading(false);
    onError?.(error);
  }, [onError]);

  const getLocation = useCallback(() => {
    if (!isSupported) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);
    setAddress(null);

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [isSupported, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  const startTracking = useCallback(() => {
    if (!isSupported) return;

    const id = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );

    setWatchId(id);
  }, [isSupported, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    location,
    address,
    loading,
    error,
    getLocation,
    startTracking,
    stopTracking,
    isSupported,
  };
}