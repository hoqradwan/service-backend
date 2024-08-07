import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import {
  createSupportIntoDB,
  deleteSupportFromDB,
  getAllSupportFromDB,
  updateSupportIntoDB,
} from './support.service.js';



export const getAllSupport = catchAsync(async (req, res) => {
  const result = await getAllSupportFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All supports are retrieved successfully.',
    data: result,
  });
});

export const createSupport = catchAsync(async (req, res) => {
  const result = await createSupportIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Support is added successfully.',
    data: result,
  });
});

export const updateSupport = catchAsync(async (req, res) => {
  const supportId = req.params?.id;
  const result = await updateSupportIntoDB(supportId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Support is updated successfully.',
    data: result,
  });
});


export const deleteSupport = catchAsync(async (req, res) => {
  const supportId = req.params?.id;
  if (!supportId) {
    throw new Error('id is required!');
  }
  const result = await deleteSupportFromDB(supportId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Support is deleted successfully.',
    data: result,
  });
});

