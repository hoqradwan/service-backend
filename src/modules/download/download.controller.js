import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { addDownloadIntoDB, getMyDownloadsFromDB } from './download.service.js';


export const addDownload = catchAsync(async (req, res) => {
  const result = await addDownloadIntoDB(req.body, req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Item is downloaded successfully.',
    data: result,
  });
});
export const getMyDownloads = catchAsync(async (req, res) => {
  const result = await getMyDownloadsFromDB(req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'My all downloads are retrieved successfully.',
    data: result,
  });
});


