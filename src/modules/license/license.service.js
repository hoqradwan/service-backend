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
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'asc',
  } = paginationOptions;

  const query = { ...filters };

  const sortOptions = [
    'dayLimit',
    'dailyLimit',
    'totalLimit',
    'createdAt',
  ].includes(sortBy)
    ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
    : { createdAt: 1 }; // Default sorting

  const skip = (page - 1) * limit;

  const result = await LicenseModel.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'users', 
        localField: 'user', 
        foreignField: '_id', 
        as: 'userDetails', 
      },
    },
    {
      $unwind: {
        path: '$userDetails',
        preserveNullAndEmptyArrays: true, // Keep licenses with no associated user
      },
    },
    {
      $addFields: {
        userEmail: '$userDetails.email', // Add userEmail field
      },
    },
    {
      $sort: sortOptions, // Sort before assigning serial numbers
    },
    {
      $setWindowFields: {
        sortBy: sortOptions,
        output: {
          serial: {
            $documentNumber: {}, // Generates a sequential number for each document
          },
        },
      },
    },
    {
      $project: {
        createdAt: 0, // Exclude these fields from each license document
        updatedAt: 0,
        __v: 0,
        userDetails: 0, 
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  const total = await LicenseModel.countDocuments(query);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
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

  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'asc',
  } = paginationOptions;

  // Define sorting options based on the request
  const sortOptions = {};
  if (['dayLimit', 'dailyLimit', 'totalLimit', 'createdAt'].includes(sortBy)) {
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sortOptions['createdAt'] = 1; // Default sorting by createdAt
  }

  // Fetch the data from the database with pagination
  const result = await LicenseModel.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit);

  // Add serial numbers to the results
  const resultWithSerial = result.map((item, index) => ({
    ...item.toObject(),
    serial: (page - 1) * limit + index + 1, // Serial number based on the pagination
  }));

  // Calculate the total number of documents that match the query
  const total = await LicenseModel.countDocuments(query);

  // Return the data with pagination information
  return {
    data: resultWithSerial,
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
      licenseToUpdate?.expiryDate?.getTime(),
    ).setDate(licenseToUpdate?.expiryDate?.getDate() + data.dayLimit);
    result = await LicenseModel.findByIdAndUpdate(
      licenseid,
      { ...data, expiryDate: new Date(newExpiryDate) },
      {
        new: true, // Return the updated document..
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

    // Find the license to get dayLimit for expiryDate calculation.
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


export const suspendLicenseIntoDB = async (licenseId) => {
  const license = await LicenseModel.findById(licenseId);
  if (license.status === 'used') {
    const result = await LicenseModel.findByIdAndUpdate(licenseId, {
      status: 'suspended',
    });
    return {
      result,
      message : "License updated to suspended "
    };
  }
  const result = await LicenseModel.findByIdAndUpdate(licenseId, {
    status: 'used',
  });
  return {
     result,
      message : "License updated to Used"
  };
};