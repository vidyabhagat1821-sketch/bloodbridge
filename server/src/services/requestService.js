import { db } from '../config/db.js';
import { MatchingService } from './matchingService.js';
import { NotificationService } from './notificationService.js';
import { normalizeBloodGroup } from '../utils/bloodCompatibility.js';

export class RequestService {
  static getAllRequests(filter = {}) {
    let requests = db.collection('requests').find();

    if (filter.hospitalId) {
      requests = requests.filter((r) => r.hospitalId === filter.hospitalId);
    }
    if (filter.status) {
      requests = requests.filter((r) => r.status.toUpperCase() === filter.status.toUpperCase());
    }
    if (filter.bloodGroup) {
      requests = requests.filter((r) => r.bloodGroup === filter.bloodGroup);
    }

    return requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static getRequestById(id) {
    const request = db.collection('requests').findById(id);
    if (!request) throw new Error('Blood request not found.');

    // Attach current matched donors
    const matched = MatchingService.findMatchingDonors({
      bloodGroup: request.bloodGroup,
      hospitalLocation: request.hospitalLocation,
      maxDistanceKm: 100
    });

    return {
      ...request,
      matchedDonors: matched.donors
    };
  }

  static createRequest(data) {
    const {
      hospitalId,
      hospitalName,
      hospitalLocation,
      bloodGroup,
      unitsRequired = 1,
      urgency = 'CRITICAL',
      patientCondition = 'Emergency Patient',
      description = ''
    } = data;

    const normalizedGroup = normalizeBloodGroup(bloodGroup);
    if (!normalizedGroup) {
      throw new Error(`Invalid blood group provided: "${bloodGroup}". Must be one of A+, A-, B+, B-, AB+, AB-, O+, O-.`);
    }

    if (!unitsRequired || Number(unitsRequired) < 1) {
      throw new Error('Number of blood units required must be at least 1.');
    }

    const request = db.collection('requests').insert({
      hospitalId: hospitalId || 'hosp_custom',
      hospitalName: hospitalName || 'Emergency Medical Center',
      hospitalLocation: hospitalLocation || {
        lat: 37.7558,
        lng: -122.4048,
        address: 'Emergency Trauma Wing'
      },
      bloodGroup: normalizedGroup,
      unitsRequired: Number(unitsRequired),
      urgency: urgency.toUpperCase(),
      patientCondition,
      description,
      status: 'ACTIVE',
      responses: [],
      matchedDonorsCount: 0
    });

    // Auto-discover matching donors and trigger notifications
    const matched = MatchingService.findMatchingDonors({
      bloodGroup: normalizedGroup,
      hospitalLocation: request.hospitalLocation,
      maxDistanceKm: 60
    });

    db.collection('requests').update(request.id, {
      matchedDonorsCount: matched.totalMatched
    });

    // Send emergency alert notifications to matched donors
    matched.donors.forEach((donor) => {
      NotificationService.createNotification({
        recipientId: donor.id,
        recipientType: 'donor',
        title: `🚨 ${request.urgency} BLOOD NEEDED: ${normalizedGroup}`,
        message: `${request.hospitalName} urgently requires ${request.unitsRequired} unit(s) of ${normalizedGroup} blood (${donor.distanceKm} km away from your location).`,
        type: 'EMERGENCY_REQUEST',
        requestId: request.id
      });
    });

    return {
      ...request,
      matchedDonorsCount: matched.totalMatched,
      matchedDonors: matched.donors
    };
  }

  static updateRequest(id, updates) {
    const existing = db.collection('requests').findById(id);
    if (!existing) throw new Error('Request not found.');

    const updated = db.collection('requests').update(id, updates);
    return updated;
  }

  static deleteRequest(id) {
    const existing = db.collection('requests').findById(id);
    if (!existing) throw new Error('Request not found.');

    db.collection('requests').delete(id);
    return { success: true, message: 'Blood request removed successfully.' };
  }

  static respondToRequest(requestId, donorId, status, etaMinutes = 30) {
    const request = db.collection('requests').findById(requestId);
    if (!request) throw new Error('Request not found.');

    const donor = db.collection('donors').findById(donorId);
    if (!donor) throw new Error('Donor profile not found.');

    const cleanStatus = status.toUpperCase(); // 'ACCEPTED' | 'DECLINED'
    if (!['ACCEPTED', 'DECLINED'].includes(cleanStatus)) {
      throw new Error('Status must be either "ACCEPTED" or "DECLINED".');
    }

    const responses = request.responses || [];
    const existingIndex = responses.findIndex((r) => r.donorId === donorId);

    const responseItem = {
      donorId,
      donorName: donor.fullName,
      donorMobile: donor.mobileNumber,
      bloodGroup: donor.bloodGroup,
      status: cleanStatus,
      etaMinutes: Number(etaMinutes) || 30,
      respondedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      responses[existingIndex] = responseItem;
    } else {
      responses.push(responseItem);
    }

    const updated = db.collection('requests').update(requestId, { responses });

    // Send notification to hospital
    NotificationService.createNotification({
      recipientId: request.hospitalId,
      recipientType: 'hospital',
      title: cleanStatus === 'ACCEPTED' ? `✅ Donor Accepted Request!` : `⚠️ Donor Declined`,
      message: `${donor.fullName} (${donor.bloodGroup}) ${cleanStatus === 'ACCEPTED' ? `accepted your request for ${request.bloodGroup} with ETA ${etaMinutes} mins.` : 'declined your request.'}`,
      type: 'DONOR_RESPONSE',
      requestId: request.id
    });

    return updated;
  }

  static completeRequest(requestId) {
    const request = db.collection('requests').findById(requestId);
    if (!request) throw new Error('Request not found.');

    const updated = db.collection('requests').update(requestId, {
      status: 'FULFILLED',
      completedAt: new Date().toISOString()
    });

    return updated;
  }
}
