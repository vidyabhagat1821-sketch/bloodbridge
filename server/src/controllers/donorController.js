import { db } from '../config/db.js';
import { calculateDistanceKm } from '../utils/distance.js';
import { isCompatible, normalizeBloodGroup } from '../utils/bloodCompatibility.js';

export class DonorController {
  static async getAllDonors(req, res, next) {
    try {
      const { bloodGroup, isAvailable, lat, lng, radiusKm = 50 } = req.query;
      let donors = db.collection('donors').find();

      if (isAvailable !== undefined) {
        const boolVal = isAvailable === 'true' || isAvailable === true;
        donors = donors.filter((d) => d.isAvailable === boolVal);
      }

      if (bloodGroup) {
        const norm = normalizeBloodGroup(bloodGroup);
        if (norm) {
          donors = donors.filter((d) => isCompatible(d.bloodGroup, norm));
        }
      }

      if (lat && lng) {
        donors = donors.map((d) => {
          const dist = d.location ? calculateDistanceKm(lat, lng, d.location.lat, d.location.lng) : 999;
          return { ...d, distanceKm: dist };
        }).filter((d) => d.distanceKm <= Number(radiusKm))
          .sort((a, b) => a.distanceKm - b.distanceKm);
      }

      res.json({
        success: true,
        count: donors.length,
        donors
      });
    } catch (err) {
      next(err);
    }
  }

  static async getDonorById(req, res, next) {
    try {
      const donor = db.collection('donors').findById(req.params.id);
      if (!donor) {
        return res.status(404).json({ success: false, message: 'Donor not found.' });
      }
      res.json({ success: true, donor });
    } catch (err) {
      next(err);
    }
  }

  static async updateDonor(req, res, next) {
    try {
      const donor = db.collection('donors').findById(req.params.id);
      if (!donor) {
        return res.status(404).json({ success: false, message: 'Donor not found.' });
      }

      const updated = db.collection('donors').update(req.params.id, req.body);
      res.json({ success: true, donor: updated, message: 'Donor profile updated successfully.' });
    } catch (err) {
      next(err);
    }
  }

  static async updateAvailability(req, res, next) {
    try {
      const { isAvailable } = req.body;
      const donor = db.collection('donors').findById(req.params.id);
      if (!donor) {
        return res.status(404).json({ success: false, message: 'Donor not found.' });
      }

      const updated = db.collection('donors').update(req.params.id, {
        isAvailable: Boolean(isAvailable)
      });

      res.json({
        success: true,
        donor: updated,
        message: `Availability updated to ${isAvailable ? 'AVAILABLE (Ready to donate)' : 'UNAVAILABLE'}`
      });
    } catch (err) {
      next(err);
    }
  }
}
