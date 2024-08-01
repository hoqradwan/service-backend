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
  try {
    const result = await getLicensesFromDB();
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
