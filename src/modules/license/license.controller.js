import {
  createLicenseIntoDB,
  getLicensesFromDB,
  updateLicenseIntoDB,
  deleteLicenseFromDB,
} from './license.service.js';

export const createLicense = async (req, res) => {
  try {
    const result = await createLicenseIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: 'License created successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
export const allLicenses = async (req, res) => {
  const user = req.user;
  console.log(user);
  try {
    const { page, limit, sortBy, sortOrder, status, serviceName, expiryDate } =
      req.query;

    const filters = {};
    if (status) filters.status = status;
    if (serviceName) filters.serviceName = serviceName;
    if (expiryDate) filters.expiryDate = { $gte: new Date(expiryDate) };

    const paginationOptions = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'asc',
    };

    const result = await getLicensesFromDB(filters, paginationOptions);
    res.status(200).json({
      success: true,
      message: 'Licenses retrieved successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
export const updateLicense = async (req, res) => {
  const licenseId = req.params.id;
  try {
    const result = await updateLicenseIntoDB(licenseId, req.body);
    res.status(200).json({
      success: true,
      message: 'License updated successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
export const activateLicense = async (licenseKey, user) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the license by licenseKey and update its status to 'used' and set the user
    const license = await LicenseModel.findOneAndUpdate(
      { licenseKey, status: 'new' },
      { status: 'used', user: user._id },
      { new: true, session }, // Include the session
    );

    if (!license) {
      throw new Error('License not found or already used.');
    }

    // Update the user's isActive status
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id, // Use user._id for consistency
      { isActive: true },
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
export const deleteLicense = async (req, res) => {
  const licenseId = req.params.id;
  try {
    const result = await deleteLicenseFromDB(licenseId);
    res.status(200).json({
      success: true,
      message: 'License deleted successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
