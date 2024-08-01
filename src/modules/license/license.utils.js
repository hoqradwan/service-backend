import crypto from 'crypto';

// Utility function to generate a license key
export const generateLicenseKey = (length = 32) => {
  return crypto
    .randomBytes(length)
    .toString('base64')
    .replace(/\+/g, '0')
    .replace(/\//g, '1')
    .substring(0, length);
};
