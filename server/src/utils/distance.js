/**
 * Geospatial distance calculation using Haversine formula
 */

/**
 * Calculates distance between two lat/lng points in kilometers
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in km, rounded to 1 decimal place
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 9999;
  }
  
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(Number(lat2) - Number(lat1));
  const dLon = deg2rad(Number(lon2) - Number(lon1));
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(Number(lat1))) * Math.cos(deg2rad(Number(lat2))) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
