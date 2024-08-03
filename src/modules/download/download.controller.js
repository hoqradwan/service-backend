import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { addDownloadIntoDB, getDailyDownloadForCookieService, getDailyDownloadForLicenseService, getDailyDownloadForUserService, getMyDownloadsFromDB, getTotalDownloadForCookieService, getTotalDownloadForLicenseService, getTotalDownloadForUserService } from './download.service.js';
import { getRandomAccountService, getTotalDocumentCountService } from '../cookie/cookie.service.js';
import axios from 'axios';
import { cookieCredentials } from './download.utils.js';


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
  const result = await getTotalDownloadForCookieService(serviceId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total download  for service is retrieved successfully',
    data: result,
  });
});


// download request to envato official website
export const handleDownload = async (req, res) => {
  try {
    console.log("hitting");
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ isOk: false, message: 'URL is required' });
    }

    // Getting random cookie details
    const cookieDetails = await generateRandomAccount();

    const { payload, headers, mainURL } = await cookieCredentials(cookieDetails, url);

    if (!payload) {
      return res.status(400).json({ isOk: false, message: 'Payload is required' });
    }
    if (!headers) {
      return res.status(400).json({ isOk: false, message: 'Headers is required' });
    }

    // Make the first HTTP request
    const response = await axios({
      method: 'POST',
      url: mainURL,
      headers: headers,
      data: payload,
    });
    if (!response) {
      return res.status(400).json({ isOk: false, message: 'Item code is not valid' })
    }
    // Extract the download URL from the first response
    const downloadUrl = response?.data?.data?.attributes?.downloadUrl;
    // console.log("download link", downloadUrl);

    if (downloadUrl) {
      return res.status(200).json({
        isOk: true,
        serviceId: cookieDetails?._id,
        message: "Download request successful",
        downloadUrl
      });
    }
    else {
      return res.status(400).json({
        isOk: false,
        message: "Download request is unsuccessful",
      });
    }


  } catch (error) {
    console.error('Error handling download:', error);
    res.status(500).json({ isOk: false, message: 'Internal server error' });
  }
};

// Random account generator 
export const generateRandomAccount = async () => {
  try {
    const count = await getTotalDocumentCountService();
    // console.log("total accounts = ", count);

    // Generating a random number 
    const randomIndex = Math?.floor(Math?.random() * count);

    // Getting the random account
    const randomAccount = await getRandomAccountService(randomIndex);
    return randomAccount;
  } catch (error) {
    console.error('Error fetching random account:', error);
  }
}
