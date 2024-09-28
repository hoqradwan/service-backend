import axios from 'axios';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import {
  getCookieByIdService,
  getRandomAccountService,
  getTotalDocumentCountService,
  updateCookieByIdService,
} from '../cookie/cookie.service.js';
import { getLicenseByIdService } from '../license/license.service.js';
import {
  addDownloadIntoDB,
  downloadCountService,
  getDailyDownloadForCookieService,
  getDailyDownloadForLicenseService,
  getDailyDownloadForUserService,
  getDownloadById,
  getMyDownloadsFromDB,
  getTotalDownloadForCookieService,
  getTotalDownloadForLicenseService,
  getTotalDownloadForUserService,
  updateDownloadByIdService,
} from './download.service.js';
import { envatoCookieCredentials, motionArrayCookieCredentials, StoryBlocksCookieCredentials } from './download.utils.js';
import { findUserById } from '../user/user.service.js';
import fetch from 'node-fetch';
import { isCookieValid, isMotionArrayCookieValid, isStoryBlocksCookieValid } from '../cookie/cookie.controller.js';
import puppeteer from 'puppeteer';
const cheerio = await import('cheerio');


export const addDownload = catchAsync(async (req, res) => {
  const download = req.body;
  const result = await addDownloadIntoDB(download, req.user);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Item is added successfully.',
      data: null,
    });
  }
});

export const getMyDownloads = catchAsync(async (req, res) => {
  const result = await getMyDownloadsFromDB(req.user);
  if (result?.length === 0) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No document found',
      data: null,
    });
  }
  const totalDownloads = await downloadCountService(req?.user?.email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'My all downloads are retrieved successfully.',
    data: {
      result,
      totalDownloads,
    },
  });
});

// daily download count by user email
export const getDailyDownloadForUser = catchAsync(async (req, res) => {
  const role = req?.user?.role;
  let email = null;
  if (role === 'admin') {
    const id = req?.params?.id;
    const user = await findUserById(id);
    if (!user) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus?.BAD_REQUEST,
        message: 'No user found with this id',
        data: null,
      });
    }
    email = user?.email;
  } else if (role === 'user') {
    email = req?.user?.email;
    if (!email) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus?.BAD_REQUEST,
        message: 'Could not find user',
        data: null,
      });
    }
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
  if (role === 'admin') {
    const id = req?.params?.id;
    const user = await findUserById(id);
    if (!user) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus?.BAD_REQUEST,
        message: 'No user found with this id',
        data: null,
      });
    }
    email = user?.email;
  } else if (role === 'user') {
    email = req?.user?.email;
    if (!email) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus?.BAD_REQUEST,
        message: 'Could not find user',
        data: null,
      });
    }
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
  if (role === 'admin') {
    licenseId = req?.query?.licenseId;
  } else if (role === 'user') {
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
    throw new Error('Invalid licenseId format! expected ObjectId');
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
  if (role === 'admin') {
    licenseId = req?.query?.licenseId;
  } else if (role === 'user') {
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
    throw new Error('Invalid licenseId format! expected ObjectId');
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
    throw new Error('invalid serviceId format! expected ObjectId');
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
    throw new Error('invalid serviceId format! expected ObjectId');
  }

  const result = await getTotalDownloadForCookieService(serviceId);
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total download  for service is retrieved successfully',
    data: result,
  });
});



// Random account generator
export const generateRandomAccount = async (serviceName) => {
  try {
    const count = await getTotalDocumentCountService(serviceName);
    // Ensure there's at least one active cookie
    if (count === 0) {
      return null;
    }
    // Generating a random number
    const randomIndex = Math?.floor(Math?.random() * count);

    // Getting the random account
    const randomAccount = await getRandomAccountService(serviceName, randomIndex);

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

    if (license?.status === 'new') {
      return { isOk: false, message: 'License is not activated yet' };
    }
    if (license?.status === 'expired') {
      return { isOk: false, message: 'License is expired' };
    }
    if (license?.status === 'suspended') {
      return { isOk: false, message: 'your account is suspended ' };
    }

    const { count } = await getDailyDownloadForLicenseService(licenseId);
    const { count: totalCount } =
      await getTotalDownloadForLicenseService(licenseId);

    if (license?.dailyLimit > count && license?.totalLimit > totalCount) {
      return { isOk: true, exceeded: false };
    } else {
      return { isOk: true, exceeded: true };
    }
  } catch (error) {
    console.error('Error checking daily limit:', error);
    return { isOk: false, message: 'Internal server error' };
  }
};

// download request for license
export const handleLicenseDownload = catchAsync(async (req, res) => {
  const downloadId = req?.params?.downloadId;

  if (!downloadId) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Download Id is not provided',
      data: null,
    });
  }

  // Check if Download Id is a valid MongoDB ObjectId
  if (!mongoose?.Types?.ObjectId?.isValid(downloadId)) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Invalid Download Id format',
      data: null,
    });
  }

  const { contentLicense, downloadedBy, serviceId } =
    await getDownloadById(downloadId);

  if (!contentLicense || !downloadedBy || !serviceId) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'This file does not exist',
      data: null,
    });
  }

  if (req?.user?.role === 'user' && req?.user?.email !== downloadedBy) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.FORBIDDEN,
      message: 'You are not authorized for this license',
      data: null,
    });
  }

  const { cookie } = await getCookieByIdService(serviceId);

  if (!cookie) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Couldn't find cookie for this download",
      data: null,
    });
  }

  const response = await fetch(contentLicense, {
    method: 'GET',
    headers: {
      Cookie: `_elements_session_4=${cookie}`,
    },
  });

  const body = await response?.text();

  if (response?.ok) {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="license.txt"');
    res.send(body);
  } else {
    return sendResponse(res, {
      success: false,
      statusCode: response.status,
      message: 'Error fetching the license file.',
      data: null,
    });
  }
});

// Update method for download with _id
export const updateDownloadById = catchAsync(async (req, res) => {
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
  const updatedDownload = await updateDownloadByIdService(id, updateData);

  // Check if the cookie exists
  if (!updatedDownload) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'Download not found',
      data: null,
    });
  }

  // Send a success response with the updated cookie data
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Download updated successfully!',
    data: null,
  });
});

// download request to envato official website
export const handleEnvatoDownload = catchAsync(async (req, res) => {
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
      message: 'Invalid user Id format',
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

  // checking if daily limit has been exceeded or not..
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
      message: 'Download limit is exceeded',
      data: null,
    });
  }

  let cookieDetails = null;
  // Getting random cookie details
  for (let i = 0; i < 3; i++) {
    const cookie = await generateRandomAccount("envato");

    if (!cookie) {
      break;
    }
    let isCookieWorking;
    // Loop for double check the cookie
    for (let j = 0; j < 2; j++) {
      isCookieWorking = await isCookieValid(cookie);
      if (isCookieWorking) {
        break;
      }
    }

    if (!isCookieWorking) {
      // if cookie is not valid then make it inactive
      await updateCookieByIdService(cookie?._id, { "status": "inactive" })
    }

    if (isCookieWorking) {
      cookieDetails = cookie;
      break;
    }
  }

  if (!cookieDetails) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'No working account found',
      data: null,
    });
  }


  const { payload, headers, mainURL } = await envatoCookieCredentials(
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
      message: 'Item code is not valid',
      data: null,
    });
  }

  // Extract the download URL from the response
  const downloadUrl = response?.data?.data?.attributes?.downloadUrl;
  const textDownloadUrl = response?.data?.data?.attributes?.textDownloadUrl;
  const licenseUrl = `https://elements.envato.com${textDownloadUrl}`;

  if (downloadUrl) {
    const download = {
      service: "Envato Elements",
      content: url,
      contentLicense: licenseUrl,
      serviceId: cookieDetails?._id,
      licenseId: licenseId,
      status: "pending"
    }
    const result = await addDownloadIntoDB(download, req.user);

    if (result) {
      return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Download request successful',
        data: { downloadUrl, downloadId: result[0]?._id },
      });
    }

  } else {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Download request is unsuccessful',
      data: null,
    });
  }
});

// Request for getting Story-Blocks Item Code
const getStoryBlockItemCode = async (url) => {

  try {
    const response = await axios({
      method: 'GET',
      url: url
    });

    const $ = cheerio?.load(response?.data);
    const scriptTags = $('script');

    let stockItemData;

    scriptTags?.each((i, script) => {
      const scriptContent = $(script)?.html();

      const stockItemMatch = scriptContent?.match(/"stockItem":\s*({[\s\S]*?})/);
      if (stockItemMatch && stockItemMatch[1]) {
        stockItemData = stockItemMatch[1];
      }
    });

    // Use regex to directly extract the ID and content-class
    const idMatch = stockItemData?.match(/"id":\s*(\d+)/);
    const contentClassMatch = stockItemData?.match(/"contentClass":"([^"]+)"/);

    const itemCode = idMatch ? idMatch[1] : null;
    const contentClass = contentClassMatch ? contentClassMatch[1] : null;
    return { itemCode, contentClass }

  } catch (error) {
    console.log("Error in getting item code and content-class:", error);
  }
};

// download request to storyBlocks official website
export const handleStoryBlocksDownload = catchAsync(async (req, res) => {
  const { url, type } = req?.body;
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
      message: 'Invalid user Id format',
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
  const licenseId = user?.currentStoryBlocksLicense;
  if (!licenseId) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'You do not have a license activated',
      data: null,
    });
  }

  // // Check if licenseId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(licenseId)) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Invalid License Id format',
      data: null,
    });
  }

  // // checking if daily limit has been exceeded or not..
  const limitCheck = await isDailyLimitExceed(licenseId);

  if (!limitCheck?.isOk) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: limitCheck?.message,
      data: null,
    });
  }

  if (limitCheck?.exceeded) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Download limit is exceeded',
      data: null,
    });
  }

  let cookieDetails = null;
  // Getting random cookie details
  for (let i = 0; i < 3; i++) {
    const cookie = await generateRandomAccount("story-blocks");

    if (!cookie) {
      break;
    }
    let isCookieWorking;
    // Loop for double check the cookie
    for (let j = 0; j < 2; j++) {
      isCookieWorking = await isStoryBlocksCookieValid(cookie);

      if (isCookieWorking) {
        break;
      }
    }

    if (!isCookieWorking) {
      // if cookie is not valid then make it inactive
      await updateCookieByIdService(cookie?._id, { "status": "inactive" })
    }

    if (isCookieWorking) {
      cookieDetails = cookie;
      break;
    }
  }

  if (!cookieDetails) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'No working account found',
      data: null,
    });
  }


  const { itemCode, contentClass } = await getStoryBlockItemCode(url);

  if (!itemCode || !contentClass) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Invalid story-blocks item url',
      data: null,
    });
  }

  const { headers, mainURL } = await StoryBlocksCookieCredentials(
    cookieDetails,
    contentClass.toLowerCase(),
    itemCode,
    type.toUpperCase()
  );

  if (!headers) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Headers are required',
      data: null,
    });
  }

  if (!mainURL) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'MainUrl is required',
      data: null,
    });
  }

  // Make the first HTTP request
  const response = await axios({
    method: 'GET',
    url: mainURL,
    headers: headers,
  });
  // console.log(response?.data);

  if (!response) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Item code or type is not valid',
      data: null,
    });
  }

  // Extract the download URL from the response
  const downloadUrl = response?.data?.data?.downloadUrl;

  if (downloadUrl) {
    const download = {
      service: "Story Blocks",
      content: url,
      contentLicense: null,
      serviceId: cookieDetails?._id,
      licenseId: licenseId,
      status: "pending"
    }
    const result = await addDownloadIntoDB(download, req.user);

    if (result) {
      return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Download request successful',
        data: { downloadUrl, downloadId: result[0]?._id },
      });
    }

  } else {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Download request is unsuccessful',
      data: null,
    });
  }
});


// download request to storyBlocks official website
export const handleMotionArrayDownload = catchAsync(async (req, res) => {
  const { url, type } = req?.body;
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
      message: 'Invalid user Id format',
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
  const licenseId = user?.currentStoryBlocksLicense;
  if (!licenseId) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'You do not have a license activated',
      data: null,
    });
  }

  // // Check if licenseId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(licenseId)) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Invalid License Id format',
      data: null,
    });
  }

  // // checking if daily limit has been exceeded or not..
  const limitCheck = await isDailyLimitExceed(licenseId);

  if (!limitCheck?.isOk) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: limitCheck?.message,
      data: null,
    });
  }

  if (limitCheck?.exceeded) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Download limit is exceeded',
      data: null,
    });
  }

  let cookieDetails = null;
  // Getting random cookie details
  for (let i = 0; i < 3; i++) {
    const cookie = await generateRandomAccount("motion-array");

    if (!cookie) {
      break;
    }
    let isCookieWorking;
    // Loop for double check the cookie
    for (let j = 0; j < 2; j++) {
      isCookieWorking = await isMotionArrayCookieValid(cookie);
      if (isCookieWorking) {
        break;
      }
    }

    if (!isCookieWorking) {
      // if cookie is not valid then make it inactive
      await updateCookieByIdService(cookie?._id, { "status": "inactive" })
    }

    if (isCookieWorking) {
      cookieDetails = cookie;
      break;
    }
  }

  if (!cookieDetails) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'No working account found',
      data: null,
    });
  }

  const { headers, mainURL } = await motionArrayCookieCredentials(
    cookieDetails,
    url,
    type?.toLowerCase()
  );

  if (!headers) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Headers are required',
      data: null,
    });
  }

  if (!mainURL) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'MainUrl is required',
      data: null,
    });
  }

  const response = await motionArrayDownloadRequest(headers, mainURL);

  if (!response) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Item code or type is not valid',
      data: null,
    });
  }


  if (response) {
    const download = {
      service: "Motion Array",
      content: url,
      contentLicense: null,
      serviceId: cookieDetails?._id,
      licenseId: licenseId,
      status: "pending"
    }
    const result = await addDownloadIntoDB(download, req.user);

    if (result) {
      return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Download request successful',
        data: { downloadUrl: response, downloadId: result[0]?._id },
      });
    }

  } else {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Download request is unsuccessful',
      data: null,
    });
  }
});


// Function for getting the motion array download url
const motionArrayDownloadRequest = async (headers, mainURL) => {
  const browser = await puppeteer?.launch({
    headless: false,
  });
  const page = await browser?.newPage();

  try {
    // Set extra headers including cookies, referer, and user-agent
    await page?.setExtraHTTPHeaders(headers);

    // Navigate to the target page
    await page?.goto(mainURL, { waitUntil: 'networkidle2' });

    // Extract the signed_url from the JSON 
    const signedUrl = await page?.evaluate(() => {
      const preElement = document?.querySelector('pre');
      if (preElement) {
        const jsonData = JSON?.parse(preElement.innerText);
        return jsonData?.signed_url;
      }
      return null;
    });

    // Close the browser
    await browser.close();
    if (signedUrl) {
      return signedUrl;
    }
    else return false;
  } catch (error) {
    console.error("Error:", error.message);
    await browser.close();
  }
}