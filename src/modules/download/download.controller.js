import axios from 'axios';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import {
  getRandomAccountService,
  getTotalDocumentCountService,
} from '../cookie/cookie.service.js';
import { getLicenseByIdService } from '../license/license.service.js';
import {
  addDownloadIntoDB,
  getDailyDownloadForCookieService,
  getDailyDownloadForLicenseService,
  getDailyDownloadForUserService,
  getMyDownloadsFromDB,
  getTotalDownloadForCookieService,
  getTotalDownloadForLicenseService,
  getTotalDownloadForUserService,
} from './download.service.js';
import { cookieCredentials } from './download.utils.js';
import { findUserById } from '../user/user.service.js';

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

// daily download count by user email
export const getDailyDownloadForUser = catchAsync(async (req, res) => {
  const role = req?.user?.role;
  let email = null;
  if (role === "admin") {
    email = req?.query?.email
  }
  else if (role === "user") {
    email = req?.user?.email;
  }

  if (!email) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'User email is not provided',
      data: null,
    });
  }
  const result = await getDailyDownloadForUserService(email);
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Daily download  is retrieved successfully',
    data: result,
  });
});

// Total download count by user email
export const getTotalDownloadForUser = catchAsync(async (req, res) => {
  const role = req?.user?.role;
  let email = null;
  if (role === "admin") {
    email = req?.query?.email
  }
  else if (role === "user") {
    email = req?.user?.email;
  }
  if (!email) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'User email is not provided',
      data: null,
    });
  }
  const result = await getTotalDownloadForUserService(email);
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total download  is retrieved successfully',
    data: result,
  });
});

// daily download for license
export const getDailyDownloadForLicense = catchAsync(async (req, res) => {
  const role = req?.user?.role;
  let licenseId = null;
  if (role === "admin") {
    licenseId = req?.query?.licenseId
  }
  else if (role === "user") {
    const userId = req?.user?.id;
    const user = await findUserById(userId);
    if (!user) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: "Couldn't find the user",
        data: null,
      });
    }
    // current license of the user 
    licenseId = user?.currentLicense;
  }

  if (!licenseId) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'LicenseId is not provided',
      data: null,
    });
  }
  // Check if licenseId is a valid MongoDB ObjectId
  if (!mongoose?.Types?.ObjectId?.isValid(licenseId)) {
    throw new Error("Invalid licenseId format! expected ObjectId");
  }

  // Get the detailed data from the service
  const result = await getDailyDownloadForLicenseService(licenseId);

  // Send the response with both the total count and detailed data
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Daily download  for license retrieved successfully',
    data: result,
  });
});

// Total download count by user email
export const getTotalDownloadForLicense = catchAsync(async (req, res) => {
  const role = req?.user?.role;
  let licenseId = null;
  if (role === "admin") {
    licenseId = req?.query?.licenseId
  }
  else if (role === "user") {
    const userId = req?.user?.id;
    const user = await findUserById(userId);
    if (!user) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: "Couldn't find the user",
        data: null,
      });
    }
    // current license of the user 
    licenseId = user?.currentLicense;
  }

  if (!licenseId) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'LicenseId is not provided',
      data: null,
    });
  }

  // Check if licenseId is a valid MongoDB ObjectId
  if (!mongoose?.Types?.ObjectId?.isValid(licenseId)) {
    throw new Error("Invalid licenseId format! expected ObjectId");
  }

  const result = await getTotalDownloadForLicenseService(licenseId);
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total download for license is retrieved successfully',
    data: result,
  });
});

// daily download for license
export const getDailyDownloadForCookie = catchAsync(async (req, res) => {
  const serviceId = req?.query?.serviceId;

  if (!serviceId) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'Service id is not provided',
      data: null,
    });
  }

  // Check if serviceId is a valid MongoDB ObjectId
  if (!mongoose?.Types?.ObjectId?.isValid(serviceId)) {
    throw new Error("invalid serviceId format! expected ObjectId");
  }

  const result = await getDailyDownloadForCookieService(serviceId);
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Daily download for service retrieved successfully',
    data: result,
  });
});

// Total download count by cookie account
export const getTotalDownloadForCookie = catchAsync(async (req, res) => {
  const serviceId = req?.query?.serviceId;
  if (!serviceId) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'Service Id is not provided',
      data: null,
    });
  }
  // Check if serviceId is a valid MongoDB ObjectId
  if (!mongoose?.Types?.ObjectId?.isValid(serviceId)) {
    throw new Error("invalid serviceId format! expected ObjectId")
  }

  const result = await getTotalDownloadForCookieService(serviceId);
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total download  for service is retrieved successfully',
    data: result,
  });
});

// download request to envato official website
export const handleDownload = catchAsync(async (req, res) => {
  const { url } = req.body;
  const userId = req?.user?.id;


  if (!userId) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Couldn't generate user id",
      data: null,
    });
  }
  // Check if userId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Invalid user Id format",
      data: null,
    });
  }
  const user = await findUserById(userId);
  if (!user) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Couldn't find the user",
      data: null,
    });
  }
  // current license of the user 
  const licenseId = user?.currentLicense;
  if (!licenseId) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'You do not have a license activated',
      data: null,
    });
  }

  // Check if licenseId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(licenseId)) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Invalid License Id format',
      data: null,
    });
  }

  // checking if daily limit has been exceeded or not
  const limitCheck = await isDailyLimitExceed(licenseId);
  if (!limitCheck.isOk) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: limitCheck.message,
      data: null,
    });
  }

  if (limitCheck.exceeded) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Daily download limit is exceeded',
      data: null,
    });
  }

  // Getting random cookie details
  const cookieDetails = await generateRandomAccount();

  const { payload, headers, mainURL } = await cookieCredentials(cookieDetails, url);

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
      message: 'Item code is not valid',
      data: null,
    });
  }

  // Extract the download URL from the response
  const downloadUrl = response?.data?.data?.attributes?.downloadUrl;
  const textDownloadUrl = response?.data?.data?.attributes?.textDownloadUrl;
  const licenseUrl = `https://elements.envato.com${textDownloadUrl}`;

  if (downloadUrl) {
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Download request successful',
      data: { downloadUrl, licenseUrl, serviceId: cookieDetails?._id },
    });
  } else {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Download request is unsuccessful',
      data: null,
    });
  }
});

// Random account generator
export const generateRandomAccount = async () => {
  try {
    const count = await getTotalDocumentCountService();
    // Generating a random number
    const randomIndex = Math?.floor(Math?.random() * count);

    // Getting the random account
    const randomAccount = await getRandomAccountService(randomIndex);
    return randomAccount;
  } catch (error) {
    console.error('Error fetching random account:', error);
  }
};

// Checking if the daily download limit has exceeded or not
export const isDailyLimitExceed = async (licenseId) => {
  try {
    const license = await getLicenseByIdService(licenseId);

    if (!license) {
      return { isOk: false, message: 'License not found' };
    }

    if (license.status === 'new') {
      return { isOk: false, message: 'License is not activated yet' };
    }
    if (license.status === 'expired') {
      return { isOk: false, message: 'License is expired' };
    }

    const { count } = await getDailyDownloadForLicenseService(licenseId);

    if (license.dailyLimit > count) {
      return { isOk: true, exceeded: false };
    } else {
      return { isOk: true, exceeded: true };
    }
  } catch (error) {
    console.error('Error checking daily limit:', error);
    return { isOk: false, message: 'Internal server error' };
  }
};
