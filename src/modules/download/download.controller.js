import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { addDownloadIntoDB, getDailyDownloadCountForLicenseService, getDailyDownloadCountService, getMyDownloadsFromDB, getTotalDownloadCountForLicenseService, getTotalDownloadCountService } from './download.service.js';
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

// daily download count by user email
export const getDailyDownloadCount = catchAsync(async (req, res) => {
  const email = req?.query?.email;
  const result = await getDailyDownloadCountService(email);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Daily download count is retrieved successfully',
    data: {dailyDownloadCount : result},
  });
});

// Total download count by user email
export const getTotalDownloadCount = catchAsync(async (req, res) => {
  const email = req?.query?.email;
  const result = await getTotalDownloadCountService(email);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total download count is retrieved successfully',
    data: {totalDownloadCount : result},
  });
});

// daily download count for license
export const getDailyDownloadCountForLicense = catchAsync(async (req, res) => {
  const licenseId = req?.query?.licenseId;
  const result = await getDailyDownloadCountForLicenseService(licenseId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Daily download count for license retrieved successfully',
    data: {licenseDailyDownload : result},
  });
});

// Total download count by user email
export const getTotalDownloadCountForLicense = catchAsync(async (req, res) => {
  const licenseId = req?.query?.licenseId;
  const result = await getTotalDownloadCountForLicenseService(licenseId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total download count for license is retrieved successfully',
    data: {LicenseTotalDownload : result},
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
