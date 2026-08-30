import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { generateOtp, verifyOtp } from '../utils/otp.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_bloodbridge_jwt_key_change_in_production';

export class AuthService {
  /**
   * Send OTP to a mobile number
   */
  static async sendOtp(mobileNumber) {
    if (!mobileNumber || mobileNumber.length < 8) {
      throw new Error('Please enter a valid mobile number with country code (e.g., +919876543210)');
    }
    const cleanMobile = mobileNumber.trim();
    const otp = generateOtp(cleanMobile);
    return {
      success: true,
      message: `OTP sent successfully to ${cleanMobile}`,
      // In development/testing, return the test OTP code for convenience
      testOtp: otp
    };
  }

  /**
   * Verify OTP and return authenticated user session with JWT
   */
  static async verifyOtp(mobileNumber, otp) {
    if (!mobileNumber || !otp) {
      throw new Error('Mobile number and OTP are required.');
    }

    const cleanMobile = mobileNumber.trim();
    const verification = verifyOtp(cleanMobile, otp);
    if (!verification.valid) {
      throw new Error(verification.message || 'Invalid or expired OTP');
    }

    // Check if user exists
    let user = db.collection('users').findOne((u) => u.mobileNumber === cleanMobile);

    let profile = null;
    if (user) {
      if (user.role === 'donor') {
        profile = db.collection('donors').findOne((d) => d.userId === user.id || d.mobileNumber === cleanMobile);
      } else if (user.role === 'hospital') {
        profile = db.collection('hospitals').findOne((h) => h.userId === user.id || h.mobileNumber === cleanMobile);
      }
    } else {
      // New user auto-registration placeholder if not already signed up
      user = db.collection('users').insert({
        mobileNumber: cleanMobile,
        role: 'donor'
      });
      // create default donor profile
      profile = db.collection('donors').insert({
        userId: user.id,
        fullName: 'Blood Donor',
        mobileNumber: cleanMobile,
        bloodGroup: 'O+',
        isAvailable: true,
        address: 'San Francisco, CA',
        location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco' },
        totalDonations: 0,
        badge: 'New Lifesaver'
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        mobileNumber: user.mobileNumber,
        role: user.role,
        profileId: profile ? profile.id : null
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        mobileNumber: user.mobileNumber,
        role: user.role
      },
      profile
    };
  }

  /**
   * Register a new donor or hospital
   */
  static async register(data) {
    const { role, mobileNumber, ...profileData } = data;

    if (!mobileNumber || mobileNumber.length < 8) {
      throw new Error('Valid mobile number is required.');
    }
    if (!role || !['donor', 'hospital'].includes(role)) {
      throw new Error('Role must be either "donor" or "hospital".');
    }

    const cleanMobile = mobileNumber.trim();
    let existingUser = db.collection('users').findOne((u) => u.mobileNumber === cleanMobile);

    if (existingUser) {
      // Update role if changed
      user = db.collection('users').update(existingUser.id, { role });
    } else {
      existingUser = db.collection('users').insert({
        mobileNumber: cleanMobile,
        role
      });
    }

    let profile = null;
    if (role === 'donor') {
      const existingDonor = db.collection('donors').findOne((d) => d.mobileNumber === cleanMobile);
      const donorData = {
        userId: existingUser.id,
        fullName: profileData.fullName || 'Anonymous Donor',
        mobileNumber: cleanMobile,
        bloodGroup: profileData.bloodGroup || 'O+',
        isAvailable: profileData.isAvailable !== undefined ? profileData.isAvailable : true,
        address: profileData.address || 'Medical District',
        location: profileData.location || { lat: 37.7749, lng: -122.4194, city: 'San Francisco' },
        lastDonationDate: profileData.lastDonationDate || null,
        totalDonations: profileData.totalDonations || 0,
        badge: 'Active Lifesaver'
      };

      if (existingDonor) {
        profile = db.collection('donors').update(existingDonor.id, donorData);
      } else {
        profile = db.collection('donors').insert(donorData);
      }
    } else if (role === 'hospital') {
      const existingHosp = db.collection('hospitals').findOne((h) => h.mobileNumber === cleanMobile);
      const hospitalData = {
        userId: existingUser.id,
        hospitalName: profileData.hospitalName || 'Metropolitan Hospital',
        contactPerson: profileData.contactPerson || 'Emergency Dispatcher',
        mobileNumber: cleanMobile,
        address: profileData.address || 'Hospital Plaza',
        location: profileData.location || { lat: 37.7558, lng: -122.4048, city: 'San Francisco' },
        licenseNumber: profileData.licenseNumber || `HOSP-${Math.floor(10000 + Math.random() * 90000)}`
      };

      if (existingHosp) {
        profile = db.collection('hospitals').update(existingHosp.id, hospitalData);
      } else {
        profile = db.collection('hospitals').insert(hospitalData);
      }
    }

    const token = jwt.sign(
      {
        userId: existingUser.id,
        mobileNumber: cleanMobile,
        role,
        profileId: profile.id
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      success: true,
      token,
      user: {
        id: existingUser.id,
        mobileNumber: cleanMobile,
        role
      },
      profile
    };
  }

  /**
   * Get current authenticated user details
   */
  static async getMe(userId) {
    const user = db.collection('users').findById(userId);
    if (!user) throw new Error('User not found.');

    let profile = null;
    if (user.role === 'donor') {
      profile = db.collection('donors').findOne((d) => d.userId === user.id || d.mobileNumber === user.mobileNumber);
    } else if (user.role === 'hospital') {
      profile = db.collection('hospitals').findOne((h) => h.userId === user.id || h.mobileNumber === user.mobileNumber);
    }

    return {
      user,
      profile
    };
  }
}
