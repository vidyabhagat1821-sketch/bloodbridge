import { AuthService } from '../services/authService.js';

export class AuthController {
  static async sendOtp(req, res, next) {
    try {
      const { mobileNumber } = req.body;
      const result = await AuthService.sendOtp(mobileNumber);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async verifyOtp(req, res, next) {
    try {
      const { mobileNumber, otp } = req.body;
      const result = await AuthService.verifyOtp(mobileNumber, otp);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req, res, next) {
    try {
      const result = await AuthService.getMe(req.user.userId);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res) {
    res.json({
      success: true,
      message: 'Logged out successfully from BloodBridge session.'
    });
  }
}
