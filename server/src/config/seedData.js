/**
 * Seed data for BloodBridge initialization
 */

export const INITIAL_USERS = [
  {
    id: 'user_donor_1',
    mobileNumber: '+919876543210',
    role: 'donor',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'user_donor_2',
    mobileNumber: '+919823456781',
    role: 'donor',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'user_donor_3',
    mobileNumber: '+919741238965',
    role: 'donor',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'user_donor_4',
    mobileNumber: '+919654321870',
    role: 'donor',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'user_hospital_1',
    mobileNumber: '+911234567890',
    role: 'hospital',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: 'user_hospital_2',
    mobileNumber: '+911122334455',
    role: 'hospital',
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString()
  }
];

export const INITIAL_DONORS = [
  {
    id: 'donor_1',
    userId: 'user_donor_1',
    fullName: 'Rajesh Kumar',
    mobileNumber: '+919876543210',
    bloodGroup: 'O-',
    isAvailable: true,
    address: '45 MG Road, Koramangala',
    location: {
      lat: 12.9352,
      lng: 77.6245,
      city: 'Bengaluru',
      state: 'Karnataka'
    },
    lastDonationDate: new Date(Date.now() - 120 * 86400000).toISOString(),
    totalDonations: 6,
    badge: 'Platinum Lifesaver',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'donor_2',
    userId: 'user_donor_2',
    fullName: 'Priya Sharma',
    mobileNumber: '+919823456781',
    bloodGroup: 'O+',
    isAvailable: true,
    address: '12 Indiranagar 1st Stage, HAL',
    location: {
      lat: 12.9784,
      lng: 77.6408,
      city: 'Bengaluru',
      state: 'Karnataka'
    },
    lastDonationDate: new Date(Date.now() - 95 * 86400000).toISOString(),
    totalDonations: 4,
    badge: 'Gold Hero',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'donor_3',
    userId: 'user_donor_3',
    fullName: 'Arjun Patel',
    mobileNumber: '+919741238965',
    bloodGroup: 'A+',
    isAvailable: true,
    address: '78 Jayanagar 4th Block',
    location: {
      lat: 12.9250,
      lng: 77.5938,
      city: 'Bengaluru',
      state: 'Karnataka'
    },
    lastDonationDate: new Date(Date.now() - 100 * 86400000).toISOString(),
    totalDonations: 3,
    badge: 'Silver Champion',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'donor_4',
    userId: 'user_donor_4',
    fullName: 'Dr. Sneha Reddy',
    mobileNumber: '+919654321870',
    bloodGroup: 'B-',
    isAvailable: true,
    address: '34 Bannerghatta Road, BTM Layout',
    location: {
      lat: 12.9165,
      lng: 77.6101,
      city: 'Bengaluru',
      state: 'Karnataka'
    },
    lastDonationDate: new Date(Date.now() - 85 * 86400000).toISOString(),
    totalDonations: 5,
    badge: 'Gold Hero',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];

export const INITIAL_HOSPITALS = [
  {
    id: 'hosp_1',
    userId: 'user_hospital_1',
    hospitalName: 'Manipal Hospital Emergency & Trauma Center',
    contactPerson: 'Dr. Venkatesh Murthy (Chief of Emergency)',
    mobileNumber: '+911234567890',
    address: '98 HAL Airport Road, Old Airport Road',
    location: {
      lat: 12.9592,
      lng: 77.6480,
      city: 'Bengaluru',
      state: 'Karnataka'
    },
    licenseNumber: 'HOSP-KA-99218',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: 'hosp_2',
    userId: 'user_hospital_2',
    hospitalName: 'Narayana Health City & Transfusion Lab',
    contactPerson: 'Dr. Meera Iyer (Blood Bank Coordinator)',
    mobileNumber: '+911122334455',
    address: '258/A Bommasandra Industrial Area, Hosur Road',
    location: {
      lat: 12.8399,
      lng: 77.6770,
      city: 'Bengaluru',
      state: 'Karnataka'
    },
    licenseNumber: 'HOSP-KA-44812',
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString()
  }
];

export const INITIAL_REQUESTS = [
  {
    id: 'req_1',
    hospitalId: 'hosp_1',
    hospitalName: 'Manipal Hospital Emergency & Trauma Center',
    hospitalLocation: {
      lat: 12.9592,
      lng: 77.6480,
      address: '98 HAL Airport Road, Old Airport Road'
    },
    bloodGroup: 'O-',
    unitsRequired: 3,
    urgency: 'CRITICAL',
    patientCondition: 'Trauma Surgery / Active Hemorrhage in ICU Room 4B',
    status: 'ACTIVE',
    matchedDonorsCount: 4,
    responses: [
      {
        donorId: 'donor_1',
        donorName: 'Rajesh Kumar',
        bloodGroup: 'O-',
        status: 'ACCEPTED',
        respondedAt: new Date(Date.now() - 10 * 60000).toISOString(),
        etaMinutes: 20
      }
    ],
    createdAt: new Date(Date.now() - 35 * 60000).toISOString()
  },
  {
    id: 'req_2',
    hospitalId: 'hosp_2',
    hospitalName: 'Narayana Health City & Transfusion Lab',
    hospitalLocation: {
      lat: 12.8399,
      lng: 77.6770,
      address: '258/A Bommasandra Industrial Area, Hosur Road'
    },
    bloodGroup: 'B-',
    unitsRequired: 2,
    urgency: 'URGENT',
    patientCondition: 'Elective Cardiovascular bypass procedure backup',
    status: 'ACTIVE',
    matchedDonorsCount: 2,
    responses: [],
    createdAt: new Date(Date.now() - 120 * 60000).toISOString()
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    recipientId: 'donor_1',
    recipientType: 'donor',
    title: 'CRITICAL EMERGENCY: O- Blood Needed!',
    message: 'Manipal Hospital Trauma Center urgently requires 3 units of O- blood (2.4 km away).',
    type: 'EMERGENCY_REQUEST',
    requestId: 'req_1',
    isRead: false,
    createdAt: new Date(Date.now() - 35 * 60000).toISOString()
  },
  {
    id: 'notif_2',
    recipientId: 'donor_4',
    recipientType: 'donor',
    title: 'Urgent B- Blood Request Nearby',
    message: 'Narayana Health City requires 2 units of B- blood within 1.2 km.',
    type: 'EMERGENCY_REQUEST',
    requestId: 'req_2',
    isRead: false,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString()
  }
];

export const PRESEEDED_RAG_DOCUMENTS = [
  {
    id: 'doc_clinical_1',
    title: 'Clinical Blood Types & Universal Transfusion Protocol (WHO/AABB)',
    filename: 'who_blood_compatibility_guidelines.md',
    uploadedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    content: `# Clinical Blood Types & Universal Transfusion Protocol (WHO/AABB)

## Section 1: ABO and Rh Blood Group Systems
Human red blood cells contain antigen surface markers classified primarily under the ABO and Rhesus (RhD) blood group systems.
- Group O: Has neither A nor B surface antigens on red blood cells. Serum contains anti-A and anti-B antibodies.
- Group A: Has A antigens on red blood cells and anti-B antibodies in serum.
- Group B: Has B antigens on red blood cells and anti-A antibodies in serum.
- Group AB: Has both A and B antigens on red blood cells and neither anti-A nor anti-B antibodies in serum.
- Rh Positive (Rh+): Contains the D antigen protein.
- Rh Negative (Rh-): Lacks the D antigen protein and may produce anti-D antibodies if exposed to Rh+ red blood cells.

## Section 2: Universal Donors and Recipients
1. Universal Red Blood Cell Donor: O Negative (O-) red blood cells can be safely transfused to individuals of ANY ABO/Rh blood group (A+, A-, B+, B-, AB+, AB-, O+, O-) because O- red cells lack A, B, and RhD surface antigens. In acute traumatic exsanguination or uncrossmatched emergency resuscitation, O Negative packed red blood cells (PRBC) are the universal life-saving standard.
2. Universal Red Blood Cell Recipient: AB Positive (AB+) individuals can safely receive red blood cells of ANY blood group because their immune system already recognizes A, B, and RhD antigens as self.
3. Universal Plasma Donor: AB Positive/AB Negative plasma is the universal plasma donor because it contains no anti-A or anti-B antibodies.

## Section 3: Red Cell Transfusion Compatibility Matrix
- Recipient O-: Can receive ONLY O-
- Recipient O+: Can receive O+, O-
- Recipient A-: Can receive A-, O-
- Recipient A+: Can receive A+, A-, O+, O-
- Recipient B-: Can receive B-, O-
- Recipient B+: Can receive B+, B-, O+, O-
- Recipient AB-: Can receive AB-, A-, B-, O-
- Recipient AB+: Can receive AB+, AB-, A+, A-, B+, B-, O+, O-`
  },
  {
    id: 'doc_clinical_2',
    title: 'Blood Donor Eligibility, Health Screening & Deferral Rules',
    filename: 'donor_eligibility_criteria_manual.md',
    uploadedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    content: `# Blood Donor Eligibility, Health Screening & Deferral Rules

## Section 1: Basic Physical and Demographic Criteria
To ensure both donor safety and recipient well-being, prospective blood donors must satisfy:
1. Age Requirement: Must be between 18 and 65 years of age (16-17 with parental consent in select jurisdictions).
2. Body Weight: Minimum weight of 50 kg (110 lbs) for a standard whole blood donation (350-450 mL).
3. Hemoglobin Level: Minimum 12.5 g/dL for females and 13.0 g/dL for males.
4. Vital Signs:
   - Blood Pressure: Systolic 90-180 mmHg, Diastolic 50-100 mmHg.
   - Pulse: Regular rhythm, 50 to 100 beats per minute.
   - Body Temperature: Oral temperature must not exceed 37.5°C (99.5°F).

## Section 2: Donation Frequency and Waiting Periods
- Whole Blood Donation: Minimum interval of 56 days (8 weeks) for men, and 84 days (12 weeks) for women between donations.
- Plateletpheresis (Platelets): Minimum interval of 7 days between donations, up to a maximum of 24 donations per calendar year.
- Double Red Cell Donation: Minimum interval of 112 days (16 weeks).

## Section 3: Common Medical Deferral Periods
- Antibiotics: Must complete full course and be symptom-free for 48 hours prior to donation.
- Cold, Flu, Fever, or Acute Sore Throat: Defer until completely symptom-free for 48 hours.
- Tattoos and Body Piercings: 3-month deferral if done in an unregulated facility; no deferral if performed in a licensed medical/state-regulated studio using sterile single-use needles.
- Major Surgery: 6 months deferral following surgical healing.
- Pregnancy & Lactation: Defer during pregnancy and for 6 months postpartum or until breastfeeding ceases.`
  },
  {
    id: 'doc_clinical_3',
    title: 'Emergency Blood Transfusion Protocols & Hemorrhage Response',
    filename: 'emergency_blood_transfusion_protocols.md',
    uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    content: `# Emergency Blood Transfusion Protocols & Hemorrhage Response

## Section 1: Massive Transfusion Protocol (MTP)
A Massive Transfusion Protocol is triggered in clinical emergencies involving severe traumatic injury, ruptured abdominal aortic aneurysm, postpartum hemorrhage, or massive surgical bleeding where patients require transfusion of >= 10 units of packed red blood cells within 24 hours (or > 4 units in 1 hour).
- Balanced Transfusion Ratio: Standard trauma protocol employs a 1:1:1 ratio consisting of 1 unit of Packed Red Blood Cells (PRBC), 1 unit of Fresh Frozen Plasma (FFP), and 1 unit of Platelets to prevent dilutional coagulopathy and hypothermia.

## Section 2: Uncrossmatched Emergency Transfusions
When blood must be transfused before full antibody crossmatching (which takes 30-45 minutes):
1. Females of childbearing age (<= 50 years): Must receive uncrossmatched O Negative (O-) red blood cells to prevent RhD isoimmunization and hemolytic disease of the fetus/newborn in future pregnancies.
2. Adult Males and Post-Menopausal Females: May receive uncrossmatched O Positive (O+) red blood cells during critical shortages to preserve scarce O Negative inventories.`
  }
];
