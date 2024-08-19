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
  suspendLicenseIntoDB,
  getDailyStatisticsForUsedLicensesService,
} from './license.service.js';
import { LicenseModel } from './license.model.js';
import { getTotalAndDailyDownloadsService } from '../download/download.service.js';

export const createLicense = catchAsync(async (req, res) => {
  const license = req.body;
  const result = await createLicenseIntoDB(license);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'License created successfully',
      data: null,
    });
  }

});

export const allLicenses = catchAsync(async (req, res) => {
  const { page, limit, sortBy, sortOrder, status, serviceName, expiryDate } =
    req.query;

  const filters = {};
  if (status) filters.status = status;
  if (serviceName) filters.serviceName = serviceName;
  if (expiryDate) filters.expiryDate = { $gte: new Date(expiryDate) };

  // Build pagination options only if page and limit are provided
  let paginationOptions = {};
  if (page && limit) {
    paginationOptions = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'asc',
    };
  }

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
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
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
  if (!result) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'License not found',
      data: null,
    });
  }
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
    data: null,
  });
});

export const deleteLicense = catchAsync(async (req, res) => {
  const licenseId = req.params.id;
  const license = await LicenseModel.findById(licenseId);
  if (!license) {
    return sendError(res, httpStatus.NOT_FOUND, {
      message: 'license not found or maybe deleted.',
    });
  }
  // Update the serial numbers of users with a higher serial
  const licensesWithHigherSerial = await LicenseModel.find({
    serial: { $gt: license.serial },
  });
  for (const licenseWithHigherSerial of licensesWithHigherSerial) {
    await LicenseModel.findByIdAndUpdate(licenseWithHigherSerial._id, {
      serial: licenseWithHigherSerial.serial - 1,
    });
  }
  const result = await deleteLicenseFromDB(licenseId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'License deleted successfully',
    data: null,
  });
});


export const suspendLicense = catchAsync(async (req, res) => {
  const licenseId = req?.params?.id;
  const { result, message } = await suspendLicenseIntoDB(licenseId);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: message,
      data: result,
    });
  }

});

export const getDailyStatisticsForUsedLicenses = catchAsync(async (req, res) => {
  const totalLimit = await getDailyStatisticsForUsedLicensesService();
  const { dailyDownloads, totalDownloads } = await getTotalAndDailyDownloadsService();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Retrieved daily stats successfully",
    data: {
      totalLimit,
      dailyDownloads,
      totalDownloads
    },
  });

});