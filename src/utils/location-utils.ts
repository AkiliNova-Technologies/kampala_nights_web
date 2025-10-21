export interface AddressComponents {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  fullAddress?: string;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<AddressComponents> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (!response.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data = await response.json();

    return {
      street: data.street,
      city: data.city,
      state: data.principalSubdivision,
      country: data.countryName,
      postalCode: data.postcode,
      fullAddress: data.locality || data.plusCode,
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return {};
  }
}

export function isWithinRadius(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radius: number
): boolean {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance <= radius;
}
