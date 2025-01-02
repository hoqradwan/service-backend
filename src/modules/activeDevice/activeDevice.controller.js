import mongoose from 'mongoose';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import httpStatus from 'http-status';
import { logOutFromCurrentDeviceService } from './activeDevice.service.js';

// log out from all devices controller
export const logoutAllDevicesController = catchAsync(async (req, res) => {
  // Extract the id from the request parameters
  const { id } = req.params;

  // Check if id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Invalid Id format',
      data: null,
    });
  }

  // Find and delete the active devices by id
  const result = await logoutAllDevicesService(id);

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
    message: 'Active devices were deleted successfully!',
    data: result,
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
