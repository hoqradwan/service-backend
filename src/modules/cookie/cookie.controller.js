import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import {
  createCookieService,
  deleteCookieByIdService,
  getAllCookiesService,
  getCookieByAccountEmailService,
  getCookieByIdService,
  getTotalDocumentCountService,
  updateCookieByIdService,
} from './cookie.service.js';
import mongoose from 'mongoose';
import { cookieCredentials } from '../download/download.utils.js';
import axios from 'axios';

// create method for cookie
export const createCookie = catchAsync(async (req, res) => {
  const data = req.body;
  // Check if required data is provided
  if (
    !data.serviceName ||
    !data.account ||
    !data.project ||
    !data.cookie ||
    !data.csrfToken ||
    !data.status
  ) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Missing required fields',
      data: null,
    });
  }
  // Checking if the account with same email already exists or not
  const isAccountExist = await getCookieByAccountEmailService(data.account);
  if (isAccountExist) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Account already exists with this email',
      data: null,
    });
  }
  const savedCookie = await createCookieService(data);
  if (savedCookie) {
    // Send a success response
    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Cookie created successfully!',
      data: null,
    });
  }
});

// Get method for cookie
export const getAllCookies = catchAsync(async (req, res) => {
  // Extract page and limit from query parameters, defaulting to 1 and 10 if not provided
  const page = parseInt(req?.query?.page) || 1;
  const limit = parseInt(req?.query?.limit) || 10;

  // Retrieve paginated cookies from the database
  const cookies = await getAllCookiesService(page, limit);

  // Check if cookies exist
  if (cookies.length === 0) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No cookies found',
      data: null,
    });
  }
  const totalCookies = await getTotalDocumentCountService();
  const totalPages = Math.ceil(totalCookies / limit);
  const currentPageCookies = cookies?.length;
  // Send a success response with the cookies data
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cookies retrieved successfully!',
    data: {
      cookies,
      totalCookies,
      currentPage: page,
      totalPages,
      currentPageCookies,
    },
  });
});


// Get method for single cookie with _id
export const getCookieById = catchAsync(async (req, res) => {
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

  // Find the cookie by id
  const cookie = await getCookieByIdService(id);

  // Check if the cookie exists
  if (!cookie) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'Cookie not found',
      data: null,
    });
  }

  // Send a success response with the cookie data
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cookie retrieved successfully!',
    data: cookie,
  });
});

// Update method for cookie with _id
export const updateCookieById = catchAsync(async (req, res) => {
  // Extract the id from the request parameters
  const { id } = req?.params;

  // Update data
  const updateData = req?.body;

  // Check if id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Invalid Id format',
      data: null,
    });
  }

  // Find the cookie by id and update it with the new data
  const updatedCookie = await updateCookieByIdService(id, updateData);

  // Check if the cookie exists
  if (!updatedCookie) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'Cookie not found',
      data: null,
    });
  }

  // Send a success response with the updated cookie data
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cookie updated successfully!',
    data: null,
  });
});

// delete method for cookie with id
export const deleteCookieById = catchAsync(async (req, res) => {
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

  // Find and delete the cookie by id
  const deletedCookie = await deleteCookieByIdService(id);

  // Check if the cookie was found and deleted
  if (!deletedCookie) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'Cookie not found',
      data: null,
    });
  }

  // Send a success response confirming deletion
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cookie deleted successfully!',
    data: null,
  });
});


// Check if the cookie is expired or not 
export const isCookieWorking = catchAsync(async (req, res) => {
  const url = "https://elements.envato.com/pink-sunset-modern-retro-serif-PDNXXR2";
  // Extract the id from the request parameters
  const { id } = req?.params;
  // Check if id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Invalid Id format',
      data: null,
    });
  }

  // Getting cookie details
  const cookieDetails = await getCookieByIdService(id);
  if (!cookieDetails) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Cookie not found',
      data: null,
    });
  }

  const { payload, headers, mainURL } = await cookieCredentials(
    cookieDetails,
    url,
  );

  if (!payload) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Payload is required',
      data: null,
    });
  }

  if (!headers) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Headers are required',
      data: null,
    });
  }

  // Make the first HTTP request
  const response = await axios({
    method: 'POST',
    url: mainURL,
    headers: headers,
    data: payload,
  });

  if (!response) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Download request unsuccessful',
      data: null,
    });
  }

  // Extract the download URL from the response
  const downloadUrl = response?.data?.data?.attributes?.downloadUrl;

  if (downloadUrl) {
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Cookie is working',
      data: null,
    });
  } else {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Cookie has expired',
      data: null,
    });
  }
});