import crypto from 'crypto';
import { LicenseModel } from './license.model.js';
import { UserModel } from '../user/user.model.js';

// Utility function to generate a license key
export const generateLicenseKey = (length = 32) => {
  return crypto
    .randomBytes(length)
    .toString('base64')
    .replace(/\+/g, '0')
    .replace(/\//g, '1')
    .substring(0, length);
};
const formatDateWithOffset = (date) => {
  // Convert to UTC ISO string
  const isoString = date.toISOString(); // Example: "2024-08-01T20:20:38.366Z"

  // Replace 'Z' with '+00:00' to match the desired format
  const formattedDate = isoString.replace('Z', '+00:00');

  return formattedDate;
};

// checking if the license is expired or not
// export const updateLicenseStatus = async () => {
//   const now = new Date();
//   const formattedDate = formatDateWithOffset(now);

//   try {
//     const result = await LicenseModel.updateMany(
//       { expiryDate: { $lte: formattedDate }, status: { $ne: 'expired' } },
//       { $set: { status: 'expired' } },
//     );

//   } catch (error) {
//     console.error('Error updating license status:', error);
//   }
// };
export const updateLicenseStatus = async () => {
  const now = new Date();
  const formattedDate = formatDateWithOffset(now);

  try {
    // Step 1: Update licenses that have expired
    const expiredLicenses = await LicenseModel.find({
      expiryDate: { $lte: formattedDate },
      status: { $ne: 'expired' },
    });

    // Update the status of those licenses to "expired"
    const result = await LicenseModel.updateMany(
      { expiryDate: { $lte: formattedDate }, status: { $ne: 'expired' } },
      { $set: { status: 'expired' } },
    );

    if (expiredLicenses.length > 0) {
      const expiredLicenseIds = expiredLicenses.map((license) => license._id);

      // Step 2: Find users whose current license is in the expired licenses
      await UserModel.updateMany(
        { currentLicense: { $in: expiredLicenseIds } },
        { $set: { isActive: false } },
      );
    }
    console.log(
      `${result?.modifiedCount} licenses and users were updated successfully.`,
    );
  } catch (error) {
    console.error('Error updating license status and user activity:', error);
  }
};
