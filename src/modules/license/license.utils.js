import crypto from 'crypto';
import { LicenseModel } from './license.model.js';

// Utility function to generate a license key
export const generateLicenseKey = (length = 32) => {
  return crypto
    .randomBytes(length)
    .toString('base64')
    .replace(/\+/g, '0')
    .replace(/\//g, '1')
    .substring(0, length);
};

// checking if the license is expired or not
export const updateLicenseStatus = async () => {
  const now = new Date();
  await LicenseModel.updateMany(
    { expiryDate: { $lte: now }, status: { $ne: 'expired' } },
    { $set: { status: 'expired' } },
  );
};
