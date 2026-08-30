/**
 * Blood Compatibility Matrix and Helper Functions
 */

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Mapping of recipient blood group to compatible donor blood groups
export const RECIPIENT_TO_DONORS = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Only O- can donate to O-
};

// Mapping of donor blood group to compatible recipients
export const DONOR_TO_RECIPIENTS = {
  'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+']
};

/**
 * Checks if a donor blood group can donate to a recipient blood group
 * @param {string} donorGroup 
 * @param {string} recipientGroup 
 * @returns {boolean}
 */
export function isCompatible(donorGroup, recipientGroup) {
  const normDonor = normalizeBloodGroup(donorGroup);
  const normRecipient = normalizeBloodGroup(recipientGroup);
  if (!normDonor || !normRecipient) return false;
  
  const compatibleDonors = RECIPIENT_TO_DONORS[normRecipient] || [];
  return compatibleDonors.includes(normDonor);
}

/**
 * Returns list of donor blood groups compatible with the requested recipient blood group
 * @param {string} recipientGroup 
 * @returns {string[]}
 */
export function getCompatibleDonorGroups(recipientGroup) {
  const norm = normalizeBloodGroup(recipientGroup);
  return RECIPIENT_TO_DONORS[norm] || [];
}

/**
 * Standardize blood group string (e.g. "o positive" -> "O+", "A pos" -> "A+")
 * @param {string} input 
 * @returns {string|null}
 */
export function normalizeBloodGroup(input) {
  if (!input || typeof input !== 'string') return null;
  const clean = input.trim().toUpperCase()
    .replace(/\s+POSITIVE/g, '+')
    .replace(/\s+NEGATIVE/g, '-')
    .replace(/\s+POS/g, '+')
    .replace(/\s+NEG/g, '-')
    .replace(/POSITIVE/g, '+')
    .replace(/NEGATIVE/g, '-');
  
  const matched = clean.match(/(A|B|AB|O)[+-]/);
  if (matched) return matched[0];
  if (BLOOD_GROUPS.includes(clean)) return clean;
  return null;
}
