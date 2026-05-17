import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';

import {
  createNoticeIntoDB,
  deleteNoticeFromDB,
  getActiveNoticeByServiceFromDB,
  getAllNoticeFromDB,
  getSingleNoticeFromDB,
  updateNoticeIntoDB,
} from './notice.service.js';

export const getAllNotice = catchAsync(async (req, res) => {
  const result = await getAllNoticeFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All notices are retrieved successfully.',
    data: result,
  });
});

export const createNotice = catchAsync(async (req, res) => {
  const result = await createNoticeIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Notice is added successfully.',
    data: result,
  });
});

export const updateNotice = catchAsync(async (req, res) => {
  const noticeId = req.params?.id;

  const result = await updateNoticeIntoDB(noticeId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Notice is updated successfully.',
    data: result,
  });
});

export const deleteNotice = catchAsync(async (req, res) => {
  const noticeId = req.params?.id;

  if (!noticeId) {
    throw new Error('id is required!');
  }

  const result = await deleteNoticeFromDB(noticeId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Notice is deleted successfully.',
    data: result,
  });
});

export const getSingleNotice = catchAsync(async (req, res) => {
  const noticeId = req.params?.id;

  if (!noticeId) {
    throw new Error('id is required!');
  }

  const result = await getSingleNoticeFromDB(noticeId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Notice retrieved successfully.',
    data: result,
  });
});

export const getActiveNoticeByService = catchAsync(async (req, res) => {
  const { service } = req.params;

  const result = await getActiveNoticeByServiceFromDB(service);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Active notice fetched successfully',
    data: result,
  });
});
