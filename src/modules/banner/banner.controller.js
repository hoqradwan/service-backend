import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import {
  createBannerIntoDB,
  deleteBannerFromDB,
  getAllBannerFromDB,
} from './banner.service.js';

export const createBanner = catchAsync(async (req, res) => {
  const result = await createBannerIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Banner is created successfully.',
    data: result,
  });
});

export const deleteBanner = catchAsync(async (req, res) => {
  const bannerId = req.params?.id;
  if (!bannerId) {
    throw new Error('id is required!');
  }
  const result = await deleteBannerFromDB(bannerId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Banner is deleted successfully.',
    data: result,
  });
});

export const getAllBanner = catchAsync(async (req, res) => {
  const result = await getAllBannerFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All Banners are retrieved successfully.',
    data: result,
  });
});
