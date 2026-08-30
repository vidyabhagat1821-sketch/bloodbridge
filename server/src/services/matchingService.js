import { db } from '../config/db.js';
import { isCompatible, getCompatibleDonorGroups } from '../utils/bloodCompatibility.js';
import { calculateDistanceKm } from '../utils/distance.js';

export class MatchingService {
  /**
   * Find matching donors for a blood request based on:
   * 1. Blood compatibility (Red cell transfusion rules)
   * 2. Proximity (Haversine distance from hospital lat/lng)
   * 3. Donor availability (isAvailable === true)
   * 
   * @param {Object} params
   * @param {string} params.bloodGroup
   * @param {Object} params.hospitalLocation { lat, lng }
   * @param {number} [params.maxDistanceKm=50]
   * @param {boolean} [params.onlyAvailable=true]
   */
  static findMatchingDonors({ bloodGroup, hospitalLocation, maxDistanceKm = 50, onlyAvailable = true }) {
    const allDonors = db.collection('donors').find();
    const compatibleGroups = getCompatibleDonorGroups(bloodGroup);

    const matches = allDonors
      .filter((donor) => {
        if (onlyAvailable && !donor.isAvailable) return false;
        return isCompatible(donor.bloodGroup, bloodGroup);
      })
      .map((donor) => {
        let distanceKm = 999;
        if (hospitalLocation && hospitalLocation.lat && hospitalLocation.lng && donor.location) {
          distanceKm = calculateDistanceKm(
            hospitalLocation.lat,
            hospitalLocation.lng,
            donor.location.lat,
            donor.location.lng
          );
        }

        const isExactMatch = donor.bloodGroup === bloodGroup;

        return {
          ...donor,
          distanceKm,
          isExactMatch,
          compatibilityTier: isExactMatch ? 'Exact Match' : 'Compatible Donor (Universal/Compatible)'
        };
      })
      .filter((donor) => donor.distanceKm <= maxDistanceKm)
      .sort((a, b) => {
        // Exact match first, then closest distance
        if (a.isExactMatch && !b.isExactMatch) return -1;
        if (!a.isExactMatch && b.isExactMatch) return 1;
        return a.distanceKm - b.distanceKm;
      });

    return {
      bloodGroupRequested: bloodGroup,
      compatibleGroups,
      totalMatched: matches.length,
      donors: matches
    };
  }
}
