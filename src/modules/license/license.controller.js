import {
  createLicenseIntoDB,
  getLicensesFromDB,
  updateLicenseIntoDB,
  deleteLicenseFromDB,
  licenseByUserFromDB,
  activateLicenseIntoDB,
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
      error: error,
    });
  }
};
export const allLicenses = async (req, res) => {
  const user = req.user;
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
export const licenseByUser = async (req, res) => {
  const userId = req.params.id;
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

    const result = await licenseByUserFromDB(
      userId,
      filters,
      paginationOptions,
    );
    res.status(200).json({
      success: true,
      message: 'User licenses retrieved successfully',
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
export const activateLicense = async (req, res) => {
  const { licenseKey } = req.body;
  try {
    const result = await activateLicenseIntoDB(licenseKey, req.user);
    res.status(200).json({
      success: true,
      message: 'License activated successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
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
