import { normalizeBloodGroup } from '../utils/bloodCompatibility.js';

export function validateBloodRequestInput(req, res, next) {
  const { bloodGroup, unitsRequired } = req.body;

  if (!bloodGroup) {
    return res.status(400).json({
      success: false,
      message: 'Blood group is required.'
    });
  }

  const normalized = normalizeBloodGroup(bloodGroup);
  if (!normalized) {
    return res.status(400).json({
      success: false,
      message: `Invalid blood group "${bloodGroup}". Must be one of A+, A-, B+, B-, AB+, AB-, O+, O-.`
    });
  }

  if (unitsRequired !== undefined && (Number(unitsRequired) < 1 || isNaN(Number(unitsRequired)))) {
    return res.status(400).json({
      success: false,
      message: 'Number of units required must be at least 1.'
    });
  }

  req.body.bloodGroup = normalized;
  next();
}

export function validateRegistrationInput(req, res, next) {
  const { mobileNumber, role } = req.body;

  if (!mobileNumber || typeof mobileNumber !== 'string' || mobileNumber.trim().length < 7) {
    return res.status(400).json({
      success: false,
      message: 'Invalid mobile number. Please include standard country code and digits.'
    });
  }

  if (!role || !['donor', 'hospital'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be either "donor" or "hospital".'
    });
  }

  next();
}
