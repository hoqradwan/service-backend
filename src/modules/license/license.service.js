import mongoose from 'mongoose';
import { UserModel } from '../user/user.model.js';
import { LicenseModel } from './license.model.js';

export const createLicenseIntoDB = async (payload) => {
  console.log(payload);
  const result = await LicenseModel.create(payload);
  return result;
};
// export const getLicensesFromDB = async (
//   filters = {},
//   paginationOptions = {},
// ) => {
//   const { page, limit, sortBy, sortOrder } = paginationOptions;

//   const query = { ...filters };

//   const sortOptions = {};
//   if (['dayLimit', 'dailyLimit', 'totalLimit', 'createdAt'].includes(sortBy)) {
//     sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
//   } else {
//     sortOptions['createdAt'] = 1; // Default sorting
//   }

//   const result = await LicenseModel.find(query)
//     .sort(sortOptions)
//     .skip((page - 1) * limit)
//     .limit(limit);

//   const total = await LicenseModel.countDocuments(query);

//   return {
//     meta: {
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     },
//     data: result,
//   };
// };
export const getLicensesFromDB = async (
  filters = {},
  paginationOptions = {},
) => {
  const { page, limit, sortBy, sortOrder } = paginationOptions;

  const query = { ...filters };

  // Sort options handling
  const sortOptions = {};
  if (['dayLimit', 'dailyLimit', 'totalLimit', 'createdAt'].includes(sortBy)) {
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sortOptions['createdAt'] = 1; // Default sorting
  }

  let result;
  let total;

  // Apply pagination only if page and limit are defined
  if (page && limit) {
    result = await LicenseModel.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    total = await LicenseModel.countDocuments(query);
  } else {
    // If no pagination is applied, return all data
    result = await LicenseModel.find(query).sort(sortOptions);
    total = result.length;
  }

  return {
    meta:
      page && limit
        ? {
            total,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(total / limit),
          }
        : { total }, // Only return pagination meta if pagination is applied
    data: result,
  };
};
export const licenseByUserFromDB = async (
  userId,
  filters = {},
  paginationOptions = {},
) => {
  const query = {
    ...filters,
    user: userId,
  };

  const { page, limit, sortBy, sortOrder } = paginationOptions;

  const sortOptions = {};
  if (['dayLimit', 'dailyLimit', 'totalLimit', 'createdAt'].includes(sortBy)) {
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sortOptions['createdAt'] = 1; // Default sorting
  }

  const result = await LicenseModel.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await LicenseModel.countDocuments(query);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
export const updateLicenseIntoDB = async (licenseid, data) => {
  // Fetch the license to update
  const licenseToUpdate = await LicenseModel.findById(licenseid);

  // Log the license fetched from the database
  console.log(licenseToUpdate);

  // Initialize result variable
  let result;

  // If dayLimit is being updated and expiryDate exists, update expiryDate
  if (data.dayLimit && licenseToUpdate.expiryDate) {
    const newExpiryDate = new Date(
      licenseToUpdate.activationDate.getTime(),
    ).setDate(licenseToUpdate.activationDate.getDate() + data.dayLimit);
    result = await LicenseModel.findByIdAndUpdate(
      licenseid,
      { ...data, expiryDate: new Date(newExpiryDate) },
      {
        new: true, // Return the updated document
      },
    );
  } else {
    // If no specific logic for dayLimit, update with the provided data
    result = await LicenseModel.findByIdAndUpdate(licenseid, data, {
      new: true, // Return the updated document
    });
  }
  return result;
};

export const activateLicenseIntoDB = async (licenseKey, user) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const activationDate = new Date();
    const expiryDate = new Date(activationDate);

    // Find the license to get dayLimit for expiryDate calculation
    const licenseToUpdate = await LicenseModel.findOne({
      licenseKey,
      status: 'new',
    });
    if (!licenseToUpdate) {
      throw new Error('License not found or already used.');
    }
    expiryDate.setDate(expiryDate.getDate() + licenseToUpdate.dayLimit);

    // Update the license status to 'used', set the user, activationDate, and expiryDate
    const license = await LicenseModel.findOneAndUpdate(
      { licenseKey, status: 'new' },
      { status: 'used', user: user.id, activationDate, expiryDate },
      { new: true, session }, // Include the session
    );

    // Update the user's isActive status
    const updatedUser = await UserModel.findByIdAndUpdate(
      user.id,
      { isActive: true, currentLicense: licenseToUpdate._id },
      { new: true, runValidators: true, session }, // Ensure to return the updated document, run validators, and include the session
    );

    await session.commitTransaction();
    session.endSession();

    return { license, user: updatedUser };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};
export const deleteLicenseFromDB = async (licenseid, data) => {
  const result = await LicenseModel.findByIdAndDelete(licenseid, data);
  return result;
};

// License with _id
export const getLicenseByIdService = async (licenseId) => {
  return await LicenseModel.findById(licenseId);
};
