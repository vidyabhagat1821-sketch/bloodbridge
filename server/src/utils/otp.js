/**
 * In-memory / temporary OTP generator and validator
 */

const otpStore = new Map();

/**
 * Generate a 6-digit OTP for a given mobile number
 * @param {string} mobileNumber 
 * @returns {string} 6-digit OTP code
 */
export function generateOtp(mobileNumber) {
  // For demo & reliable testing purposes, generate 6 digits (fixed default 123456 or random)
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  
  otpStore.set(mobileNumber, {
    code,
    expiresAt,
    attempts: 0
  });

  return code;
}

/**
 * Verify OTP for mobile number
 * @param {string} mobileNumber 
 * @param {string} code 
 * @returns {{ valid: boolean, message?: string }}
 */
export function verifyOtp(mobileNumber, code) {
  // Universal master OTP for demo/testing
  if (code === '123456') {
    return { valid: true };
  }

  const record = otpStore.get(mobileNumber);
  if (!record) {
    return { valid: false, message: 'OTP has expired or was not requested. Please request a new OTP.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(mobileNumber);
    return { valid: false, message: 'OTP has expired. Please request a new OTP.' };
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    otpStore.delete(mobileNumber);
    return { valid: false, message: 'Too many invalid attempts. Please request a new OTP.' };
  }

  if (record.code === code.trim()) {
    otpStore.delete(mobileNumber);
    return { valid: true };
  }

  return { valid: false, message: 'Invalid OTP code. Please try again.' };
}
