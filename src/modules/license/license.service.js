import { UserModel } from '../user/user.model.js';
import { LicenseModel } from './license.model.js';

export const createLicenseIntoDB = async (payload) => {
  const result = await LicenseModel.create(payload);
  return result;
};
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
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
export const updateLicenseIntoDB = async (licenseid, data) => {
  const result = await LicenseModel.findByIdAndUpdate(licenseid, data);
  return result;
};
export const activateLicense = async (licenseKey, user) => {
  const license = await LicenseModel.findOneAndUpdate(
    { licenseKey, status: 'new' },
    { status: 'used', user: user._id },
    { new: true }, // Return the updated document
  );

  if (!license) {
    throw new Error('License not found or already used.');
  }
  const result = await UserModel.findByIdAndUpdate(
    user.id,
    { isActive: true },
    { new: true },
  );
  return result;
};
export const deleteLicenseFromDB = async (licenseid, data) => {
  const result = await LicenseModel.findByIdAndDelete(licenseid, data);
  return result;
};
