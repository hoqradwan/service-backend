import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import {
  getDownloadRestrictionsFromDB,
  restrictDownloadIntoDB,
  updateDownloadRestrictionIntoDB,
} from './downloadDelay.service.js';

export const getDownloadRestrictions = catchAsync(async (req, res) => {
  const result = await getDownloadRestrictionsFromDB();
  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Download restrictions retrieved successfully',
    data: result,
  });
});
export const restrictDownload = catchAsync(async (req, res) => {
  const restrictData = req.body;
  const result = await restrictDownloadIntoDB(restrictData);
  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Download restricted for user',
    data: result,
  });
});
export const updateDownloadRestriction = catchAsync(async (req, res) => {
  const updateRestrictData = req.body;
  const result = await updateDownloadRestrictionIntoDB(updateRestrictData);
  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Download restriction updated successfully',
    data: result,
  });
});
