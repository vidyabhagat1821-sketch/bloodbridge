import { db } from '../config/db.js';

export class HospitalController {
  static async getAllHospitals(req, res, next) {
    try {
      const hospitals = db.collection('hospitals').find();
      res.json({ success: true, count: hospitals.length, hospitals });
    } catch (err) {
      next(err);
    }
  }

  static async getHospitalById(req, res, next) {
    try {
      const hospital = db.collection('hospitals').findById(req.params.id);
      if (!hospital) {
        return res.status(404).json({ success: false, message: 'Hospital not found.' });
      }
      res.json({ success: true, hospital });
    } catch (err) {
      next(err);
    }
  }

  static async updateHospital(req, res, next) {
    try {
      const hospital = db.collection('hospitals').findById(req.params.id);
      if (!hospital) {
        return res.status(404).json({ success: false, message: 'Hospital not found.' });
      }

      const updated = db.collection('hospitals').update(req.params.id, req.body);
      res.json({ success: true, hospital: updated, message: 'Hospital profile updated.' });
    } catch (err) {
      next(err);
    }
  }
}
