import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useGeoLocation, type Address } from '@/hooks/useGeoLocation';
import { toast } from 'sonner';

interface LocationVerificationProps {
  businessLocation?: {
    latitude: number;
    longitude: number;
  };
  onLocationVerified?: (location: { latitude: number; longitude: number }, address?: Address) => void;
  verificationThreshold?: number; 
}

export function LocationVerification({
  businessLocation,
  onLocationVerified,
  verificationThreshold = 100,
}: LocationVerificationProps) {
  // const [isVerified, setIsVerified] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  const {
    location,
    address,
    loading,
    error,
    getLocation,
    isSupported,
  } = useGeoLocation({
    enableHighAccuracy: true,
    timeout: 15000,
    enableReverseGeocoding: true,
    onSuccess: (location, address) => {
      if (businessLocation) {
        const calculatedDistance = calculateDistance(
          location.latitude,
          location.longitude,
          businessLocation.latitude,
          businessLocation.longitude
        );
        setDistance(calculatedDistance);

        if (calculatedDistance <= verificationThreshold) {
          // setIsVerified(true);
          toast.success('Location verified successfully!');
          onLocationVerified?.(location, address);
        } else {
          // setIsVerified(false);
          toast.error(`You are ${calculatedDistance.toFixed(0)}m away from the business location`);
        }
      } else {
        // Just track location without verification
        toast.success('Location captured successfully!');
        onLocationVerified?.(location, address);
      }
    },
    onError: (error) => {
      toast.error(`Location error: ${error.message}`);
    },
  });

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handleVerifyLocation = () => {
    getLocation();
  };

  const getVerificationStatus = () => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (!location) return 'idle';
    if (businessLocation && distance !== null) {
      return distance <= verificationThreshold ? 'verified' : 'not_verified';
    }
    return 'located';
  };

  const status = getVerificationStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Verification
        </CardTitle>
        <CardDescription>
          Verify your current location for business verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSupported && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Geolocation is not supported by your browser</span>
          </div>
        )}

        {location && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Latitude:</span>
                <div className="text-muted-foreground">{location.latitude.toFixed(6)}</div>
              </div>
              <div>
                <span className="font-medium">Longitude:</span>
                <div className="text-muted-foreground">{location.longitude.toFixed(6)}</div>
              </div>
              {/* {location.accuracy && (
                <div className="col-span-2">
                  <span className="font-medium">Accuracy:</span>
                  <div className="text-muted-foreground">±{location.accuracy.toFixed(0)} meters</div>
                </div>
              )} */}
            </div>

            {address && (
              <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Address Details</span>
                </div>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {address.street && (
                    <div>
                      <span className="font-medium">Street:</span>
                      <div className="text-muted-foreground">{address.street}</div>
                    </div>
                  )}
                  {address.district && (
                    <div>
                      <span className="font-medium">District:</span>
                      <div className="text-muted-foreground">{address.district}</div>
                    </div>
                  )}
                  {address.city && (
                    <div>
                      <span className="font-medium">City:</span>
                      <div className="text-muted-foreground">{address.city}</div>
                    </div>
                  )}
                  {address.state && (
                    <div>
                      <span className="font-medium">State:</span>
                      <div className="text-muted-foreground">{address.state}</div>
                    </div>
                  )}
                  {address.country && (
                    <div>
                      <span className="font-medium">Country:</span>
                      <div className="text-muted-foreground">{address.country}</div>
                    </div>
                  )}
                  {address.postalCode && (
                    <div>
                      <span className="font-medium">Postal Code:</span>
                      <div className="text-muted-foreground">{address.postalCode}</div>
                    </div>
                  )}
                  {address.neighborhood && (
                    <div>
                      <span className="font-medium">Neighborhood:</span>
                      <div className="text-muted-foreground">{address.neighborhood}</div>
                    </div>
                  )}
                </div> */}
                {address.fullAddress && (
                  <div className="pt-2 border-t">
                    <span className="font-medium text-sm">Full Address:</span>
                    <div className="text-muted-foreground text-sm mt-1">{address.fullAddress}</div>
                  </div>
                )}
              </div>
            )}

            {businessLocation && distance !== null && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Distance from business:</span>
                <Badge
                  variant={distance <= verificationThreshold ? 'default' : 'destructive'}
                  className={
                    distance <= verificationThreshold
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {distance.toFixed(0)} meters
                </Badge>
              </div>
            )}

            <Separator />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
          variant={"outline"}
            onClick={handleVerifyLocation}
            disabled={loading || !isSupported}
            className="w-full h-12 text-md"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="size-5 mr-2" />
                {businessLocation ? 'Verify My Location' : 'Get My Location'}
              </>
            )}
          </Button>

          {status === 'verified' && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Location verified successfully!</span>
            </div>
          )}

          {status === 'not_verified' && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                Please move closer to your business location for verification
              </span>
            </div>
          )}
        </div>

        {businessLocation && (
          <div className="text-xs text-muted-foreground">
            Business location: {businessLocation.latitude.toFixed(4)}, {businessLocation.longitude.toFixed(4)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}