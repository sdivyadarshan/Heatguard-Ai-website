/**
 * Geospatial Navigation & Google Maps URL Utilities
 * Generates direct Google Maps search and turn-by-turn navigation deep links
 */

export function getGoogleMapsUrl(locationName: string, lat?: number, lng?: number): string {
  if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
    // Exact coordinate search / pin placement
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName + ', Chennai, Tamil Nadu')}`;
}

export function getGoogleMapsDirectionsUrl(destinationName: string, lat?: number, lng?: number): string {
  if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
    // Turn-by-turn direction link with destination coordinates
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationName + ', Chennai, Tamil Nadu')}&travelmode=driving`;
}

export function openGoogleMaps(locationName: string, lat?: number, lng?: number): void {
  const url = getGoogleMapsDirectionsUrl(locationName, lat, lng);
  window.open(url, '_blank', 'noopener,noreferrer');
}
