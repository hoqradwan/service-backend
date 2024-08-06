import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { addDownloadIntoDB, getDailyDownloadForCookieService, getDailyDownloadForLicenseService, getDailyDownloadForUserService, getMyDownloadsFromDB, getTotalDownloadForCookieService, getTotalDownloadForLicenseService, getTotalDownloadForUserService } from './download.service.js';
import { getRandomAccountService, getTotalDocumentCountService } from '../cookie/cookie.service.js';
import axios from 'axios';
import { cookieCredentials } from './download.utils.js';
import { getLicenseByIdService } from '../license/license.service.js';
import mongoose from 'mongoose';


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
  const email = req?.query?.email;
  if (!email) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'User email is not provided',
      data: null,
    });
  }
  const result = await getDailyDownloadForUserService(email);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Daily download  is retrieved successfully',
    data: result,
  });
});

// Total download count by user email
export const getTotalDownloadForUser = catchAsync(async (req, res) => {
  const email = req?.query?.email;
  if (!email) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'User email is not provided',
      data: null,
    });
  }
  const result = await getTotalDownloadForUserService(email);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total download  is retrieved successfully',
    data: result,
  });
});

// daily download for license
export const getDailyDownloadForLicense = catchAsync(async (req, res) => {
  const licenseId = req?.query?.licenseId;

  if (!licenseId) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'LicenseId is not provided',
      data: null,
    });
  }
  // Check if licenseId is a valid MongoDB ObjectId
  if (!mongoose?.Types?.ObjectId?.isValid(licenseId)) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'Invalid License Id format',
      data: null,
    });
  }

  // Get the detailed data from the service
  const result = await getDailyDownloadForLicenseService(licenseId);

  // Send the response with both the total count and detailed data
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Daily download  for license retrieved successfully',
    data: result,
  });
});

// Total download count by user email
export const getTotalDownloadForLicense = catchAsync(async (req, res) => {
  const licenseId = req?.query?.licenseId;

  if (!licenseId) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'LicenseId is not provided',
      data: null,
    });
  }

  // Check if licenseId is a valid MongoDB ObjectId
  if (!mongoose?.Types?.ObjectId?.isValid(licenseId)) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'Invalid License Id format',
      data: null,
    });
  }

  const result = await getTotalDownloadForLicenseService(licenseId);
  sendResponse(res, {
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
    sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'Service id is not provided',
      data: null,
    });
  }

  // Check if serviceId is a valid MongoDB ObjectId
  if (!mongoose?.Types?.ObjectId?.isValid(serviceId)) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'Invalid Service Id format',
      data: null,
    });
  }

  const result = await getDailyDownloadForCookieService(serviceId);
  sendResponse(res, {
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
    sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'Service Id is not provided',
      data: null,
    });
  }
  // Check if serviceId is a valid MongoDB ObjectId
  if (!mongoose?.Types?.ObjectId?.isValid(serviceId)) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus?.BAD_REQUEST,
      message: 'Invalid Service Id format',
      data: null,
    });
  }

  const result = await getTotalDownloadForCookieService(serviceId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total download  for service is retrieved successfully',
    data: result,
  });
});


// download request to envato official website
export const handleDownload = catchAsync(async (req, res) => {
  const { url, licenseId } = req.body;

  if (!licenseId) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "License Id is not provided",
      data: null,
    });
  }

  // Check if licenseId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(licenseId)) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Invalid License Id format",
      data: null,
    });
  }

  if (!url) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'URL is required',
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

  if (downloadUrl) {
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Download request successful",
      data: { downloadUrl, serviceId: cookieDetails?._id },
    });
  } else {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Download request is unsuccessful",
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
}

// Checking if the daily download limit has exceeded or not 
export const isDailyLimitExceed = async (licenseId) => {
  try {
    const license = await getLicenseByIdService(licenseId);
    if (!license) {
      return { isOk: false, message: "License not found" };
    }

    if (license.status === "used" || license.status === "expired") {
      return { isOk: false, message: "License is expired" };
    }

    const { count } = await getDailyDownloadForLicenseService(licenseId);

    if (license.dailyLimit > count) {
      return { isOk: true, exceeded: false };
    } else {
      return { isOk: true, exceeded: true };
    }
  } catch (error) {
    console.error('Error checking daily limit:', error);
    return { isOk: false, message: "Internal server error" };
  }
};
