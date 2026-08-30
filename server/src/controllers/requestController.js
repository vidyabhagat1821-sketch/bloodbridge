import { RequestService } from '../services/requestService.js';
import { MatchingService } from '../services/matchingService.js';

export class RequestController {
  static async getAllRequests(req, res, next) {
    try {
      const { hospitalId, status, bloodGroup } = req.query;
      const requests = RequestService.getAllRequests({ hospitalId, status, bloodGroup });
      res.json({ success: true, count: requests.length, requests });
    } catch (err) {
      next(err);
    }
  }

  static async getRequestById(req, res, next) {
    try {
      const request = RequestService.getRequestById(req.params.id);
      res.json({ success: true, request });
    } catch (err) {
      next(err);
    }
  }

  static async createRequest(req, res, next) {
    try {
      const request = RequestService.createRequest(req.body);
      res.status(201).json({
        success: true,
        message: 'Emergency blood request published and nearby matching donors alerted!',
        request
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateRequest(req, res, next) {
    try {
      const request = RequestService.updateRequest(req.params.id, req.body);
      res.json({ success: true, request, message: 'Request updated.' });
    } catch (err) {
      next(err);
    }
  }

  static async deleteRequest(req, res, next) {
    try {
      const result = RequestService.deleteRequest(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async matchDonors(req, res, next) {
    try {
      const request = RequestService.getRequestById(req.params.id);
      const { maxDistanceKm = 50, onlyAvailable = true } = req.body;
      const result = MatchingService.findMatchingDonors({
        bloodGroup: request.bloodGroup,
        hospitalLocation: request.hospitalLocation,
        maxDistanceKm: Number(maxDistanceKm),
        onlyAvailable: Boolean(onlyAvailable)
      });
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async respondToRequest(req, res, next) {
    try {
      const { donorId, status, etaMinutes } = req.body;
      const effectiveDonorId = donorId || (req.user && req.user.profileId);
      if (!effectiveDonorId) {
        return res.status(400).json({ success: false, message: 'Donor ID is required to record response.' });
      }

      const updated = RequestService.respondToRequest(
        req.params.id,
        effectiveDonorId,
        status || 'ACCEPTED',
        etaMinutes || 30
      );
      res.json({
        success: true,
        message: `Response "${status}" recorded successfully. Hospital has been notified.`,
        request: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static async completeRequest(req, res, next) {
    try {
      const updated = RequestService.completeRequest(req.params.id);
      res.json({
        success: true,
        message: 'Blood request has been marked as FULFILLED.',
        request: updated
      });
    } catch (err) {
      next(err);
    }
  }
}
