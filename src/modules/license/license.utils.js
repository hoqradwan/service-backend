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
  // Convert the date to an ISO string and replace 'Z' with '+00:00'
  return date.toISOString().replace('Z', '+00:00');
};

export const updateLicenseStatus = async () => {
  const now = new Date();
  const formattedDate = formatDateWithOffset(now); // Ensure this returns a valid date

  console.log('Formatted Date:', formattedDate);

  try {
    // Step 1: Find all licenses that have expired but are not yet marked as "expired"
    const expiredLicenses = await LicenseModel.find({
      expiryDate: { $lte: formattedDate },
      status: { $ne: 'expired' }, // Select licenses that are not already marked as expired
    });

    // console.log('Expired Licenses:', expiredLicenses);

    if (expiredLicenses.length === 0) {
      console.log('No licenses to expire.');
      return;
    }

    const expiredLicenseIds = expiredLicenses.map((license) => license._id);

    // Step 2: Update the license status to "expired"
    const updateLicensesResult = await LicenseModel.updateMany(
      { _id: { $in: expiredLicenseIds } },
      { $set: { status: 'expired' } },
    );

    console.log(
      `${updateLicensesResult.modifiedCount} licenses were marked as expired.`,
    );

    // Step 3: Find users whose current license or any other specific service license is expired
    const updateUsersResult = await UserModel.updateMany(
      {
        $or: [
          { currentLicense: { $in: expiredLicenseIds } },
          { currentStoryBlocksLicense: { $in: expiredLicenseIds } },
          { currentMotionArrayLicense: { $in: expiredLicenseIds } },
          { currentFreepikLicense: { $in: expiredLicenseIds } },
        ],
      },
      { $set: { isActive: false } },
    );

    console.log(
      `${updateUsersResult.modifiedCount} users were deactivated due to expired licenses.`,
    );
  } catch (error) {
    console.error('Error updating license status and user activity:', error);
  }
};

// export const updateLicenseStatus = async () => {
//   const now = new Date();
//   const formattedDate = formatDateWithOffset(now);

//   try {
//     // Step 1: Update licenses that have expired
//     const expiredLicenses = await LicenseModel.find({
//       expiryDate: { $lte: formattedDate },
//       status: { $ne: 'expired' },
//     });
//     console.log('Expired licenses:', expiredLicenses);

//     // Update the status of those licenses to "expired"
//     const result = await LicenseModel.updateMany(
//       { expiryDate: { $lte: formattedDate }, status: { $ne: 'expired' } },
//       { $set: { status: 'expired' } },
//     );

//     if (expiredLicenses.length > 0) {
//       const expiredLicenseIds = expiredLicenses.map((license) => license._id);

//       // Step 2: Find users whose current license is in the expired licenses
//       await UserModel.updateMany(
//         { currentLicense: { $in: expiredLicenseIds } },
//         { $set: { isActive: false } },
//       );
//     }
//     // console.log(
//     //   `${result?.modifiedCount} licenses and users were updated successfully.`,
//     // );
//   } catch (error) {
//     console.error('Error updating license status and user activity:', error);
//   }
// };
