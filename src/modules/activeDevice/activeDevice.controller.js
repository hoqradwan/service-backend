import mongoose from 'mongoose';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import httpStatus from 'http-status';
import {
  isUserSessionValidService,
  logoutAllDevicesService,
  logOutFromCurrentDeviceService,
} from './activeDevice.service.js';

// log out from all devices controller
export const logoutAllDevicesController = catchAsync(async (req, res) => {
  const userId = req?.userId;
  // Find and delete the active devices by id
  const result = await logoutAllDevicesService(userId);

  // Check if the active accounts were found and deleted
  if (!result) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No active devices were found',
      data: null,
    });
  }

  // Send a success response confirming deletion
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Logged Out from all devices successfully!',
    data: null,
  });
});

// log out from current device controller
export const logOutFromCurrentDeviceController = catchAsync(
  async (req, res) => {
    const userId = req?.userId;
    const deviceId = req?.deviceId;

    // Find and delete the active devices by id
    const result = await logOutFromCurrentDeviceService(userId, deviceId);

    // Check if the active accounts were found and deleted
    if (!result?.deletedCount) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: 'Failed to Log Out',
        data: null,
      });
    }

    // Send a success response confirming deletion
    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Logged Out successfully!',
      data: null,
    });
  },
);
// Is valid session controller
export const isUserSessionValidController = catchAsync(async (req, res) => {
  // Send a success response confirming deletion
  const { token } = req?.body;

  const result = await isUserSessionValidService(token);

  if (!result) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'Failed to Log Out',
      data: null,
    });
  }
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Valid User Session',
    data: null,
  });
});
