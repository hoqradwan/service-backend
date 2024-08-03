import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import {
  createLicenseIntoDB,
  getLicensesFromDB,
  updateLicenseIntoDB,
  deleteLicenseFromDB,
  licenseByUserFromDB,
  activateLicenseIntoDB,
} from './license.service.js';

export const createLicense = catchAsync(async (req, res) => {
  const result = await createLicenseIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'License created successfully',
    data: result,
  });
});
// export const allLicenses = catchAsync(async (req, res) => {
//   const { page, limit, sortBy, sortOrder, status, serviceName, expiryDate } =
//     req.query;

//   const filters = {};
//   if (status) filters.status = status;
//   if (serviceName) filters.serviceName = serviceName;
//   if (expiryDate) filters.expiryDate = { $gte: new Date(expiryDate) };

//   const paginationOptions = {
//     page: parseInt(page, 10) || 1,
//     limit: parseInt(limit, 10) || 10,
//     sortBy: sortBy || 'createdAt',
//     sortOrder: sortOrder || 'asc',
//   };

//   const result = await getLicensesFromDB(filters, paginationOptions);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Licenses retrieved successfully',
//     data: result,
//   });
// });
export const allLicenses = catchAsync(async (req, res) => {
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
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Licenses retrieved successfully',
    data: result,
  });
});
export const licenseByUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
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

  const result = await licenseByUserFromDB(userId, filters, paginationOptions);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Licenses retrieved successfully',
    data: result,
  });
});
export const updateLicense = catchAsync(async (req, res) => {
  const licenseId = req.params.id;
  const result = await updateLicenseIntoDB(licenseId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'License updated successfully',
    data: result,
  });
});
export const activateLicense = catchAsync(async (req, res) => {
  const { licenseKey } = req.body;
  const result = await activateLicenseIntoDB(licenseKey, req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'License activated successfully',
    data: result,
  });
});

export const deleteLicense = catchAsync(async (req, res) => {
  const licenseId = req.params.id;
  const result = await deleteLicenseFromDB(licenseId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'License deleted successfully',
    data: result,
  });
});
