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
  getTotalDownloadForAllUserService,
  getTotalDownloadForCookieService,
  getTotalDownloadForLicenseService,
  getTotalDownloadForUserService,
  updateDownloadByIdService,
} from './download.service.js';
import {
  envatoCookieCredentials,
  EnvatoPuppeteerCredential,
  freepikCookieCredentials,
  motionArrayCookieCredentials,
  StoryBlocksCookieCredentials,
  StoryBlocksPuppeteerCredential,
} from './download.utils.js';
import { findUserById } from '../user/user.service.js';
import fetch from 'node-fetch';
import {
  isCookieValid,
  isFreepikCookieValid,
  isMotionArrayCookieValid,
  isStoryBlocksCookieValid,
} from '../cookie/cookie.controller.js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { DownloadRestrict } from '../downloadDelay/downloadDelay.model.js';
import { delay } from '../downloadDelay/downloadDelay.utils.js';
const cheerio = await import('cheerio');
puppeteer.use(StealthPlugin());

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

// daily download count for envato by user email
export const getDailyEnvatoDownloadForUser = catchAsync(async (req, res) => {
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

  const result = await getDailyDownloadForUserService(email, 'Envato Elements');

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Daily download for envato is retrieved successfully',
    data: result,
  });
});

// daily download count for story blocks by user email
export const getDailyStoryBlocksDownloadForUser = catchAsync(
  async (req, res) => {
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

    const result = await getDailyDownloadForUserService(email, 'Story Blocks');

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Daily download for story blocks is retrieved successfully',
      data: result,
    });
  },
);

// daily download count for story blocks by user email
export const getDailyMotionArrayDownloadForUser = catchAsync(
  async (req, res) => {
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

    const result = await getDailyDownloadForUserService(email, 'Motion Array');

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Daily download for motion array is retrieved successfully',
      data: result,
    });
  },
);

// daily download count for story blocks by user email
export const getDailyFreepikDownloadForUser = catchAsync(async (req, res) => {
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

  const result = await getDailyDownloadForUserService(email, 'Freepik');

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Daily download for freepik is retrieved successfully',
    data: result,
  });
});

// Total download count by user email for all service
export const getTotalDownloadsForUser = catchAsync(async (req, res) => {
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
  const result = await getTotalDownloadForAllUserService(email);
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total download retrieved successfully',
    data: result,
  });
});

// Total download count by user email for envato
export const getTotalEnvatoDownloadForUser = catchAsync(async (req, res) => {
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
  const result = await getTotalDownloadForUserService(email, 'Envato Elements');
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total download for envato is retrieved successfully',
    data: result,
  });
});

// Total download count by user email for story blocks
export const getTotalStoryBlocksDownloadForUser = catchAsync(
  async (req, res) => {
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
    const result = await getTotalDownloadForUserService(email, 'Story Blocks');
    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Total download for story blocks is retrieved successfully',
      data: result,
    });
  },
);

// Total download count by user email for story blocks
export const getTotalMotionArrayDownloadForUser = catchAsync(
  async (req, res) => {
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
    const result = await getTotalDownloadForUserService(email, 'Motion Array');
    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Total download for motion array is retrieved successfully',
      data: result,
    });
  },
);

// Total download count by user email for story blocks
export const getTotalFreepikDownloadForUser = catchAsync(async (req, res) => {
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
  const result = await getTotalDownloadForUserService(email, 'Freepik');
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total download for freepik is retrieved successfully',
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
    const randomAccount = await getRandomAccountService(
      serviceName,
      randomIndex,
    );

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

  /* ------------------ Validate Download ID ------------------ */

  if (!downloadId) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Download Id is not provided',
      data: null,
    });
  }

  /* ------------------ Get Download Info ------------------ */

  const download = await getDownloadById(downloadId);

  if (!download) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'This file does not exist',
      data: null,
    });
  }

  const { contentLicense, downloadedBy, serviceId } = download;

  if (!contentLicense || !downloadedBy || !serviceId) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Invalid download data',
      data: null,
    });
  }

  /* ------------------ Authorization ------------------ */

  if (req?.user?.role === 'user' && req?.user?.email !== downloadedBy) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.FORBIDDEN,
      message: 'You are not authorized for this license',
      data: null,
    });
  }

  /* ------------------ Get Cookie ------------------ */

  const cookieData = await getCookieByIdService(serviceId);

  if (!cookieData?.cookie) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Couldn't find cookie for this download",
      data: null,
    });
  }

  const cookie = cookieData.cookie;

  /* ------------------ Get License ID ------------------ */

  const licenseLink = `https://app.envato.com/item-licenses.data?itemUuid=${contentLicense}&_routes=routes%2Fitem-licenses%2Froute`;

  const licenseRes = await fetch(licenseLink, {
    method: 'GET',
    headers: {
      Cookie: `envatoid=${cookie}`,
    },
  });

  if (!licenseRes.ok) {
    return sendResponse(res, {
      success: false,
      statusCode: licenseRes.status,
      message: 'Failed to fetch license info',
      data: null,
    });
  }

  const data = await licenseRes.json();

  let licenseId = null;

  if (Array.isArray(data)) {
    const index = data.indexOf('id');

    if (index !== -1 && typeof data[index + 1] === 'string') {
      licenseId = data[index + 1];
    }
  }

  if (!licenseId) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'No license found',
      data: null,
    });
  }

  // console.log('License ID:', licenseId);

  /* ------------------ Download License File ------------------ */

  const downloadURL = `https://app.envato.com/license-certificate/${licenseId}/download`;

  const fileRes = await fetch(downloadURL, {
    method: 'GET',
    headers: {
      Cookie: `envatoid=${cookie}`,
    },
  });

  if (!fileRes.ok) {
    return sendResponse(res, {
      success: false,
      statusCode: fileRes.status,
      message: 'Error fetching the license file',
      data: null,
    });
  }

  const body = await fileRes.text();
  // console.log('body -->', body);

  /* ------------------ Send File ------------------ */

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="license.pdf"');

  return res.send(body);
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

export const handleEnvatoDownload = catchAsync(async (req, res) => {
  const { url } = req.body;
  const userId = req?.user?.id;

  /* ------------------ User Validation ------------------ */

  if (!userId) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Couldn't generate user id",
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

  const licenseId = user.currentLicense;

  if (!licenseId) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'You do not have a license activated',
      data: null,
    });
  }

  /* ------------------ Limit Check ------------------ */

  const limitCheck = await isDailyLimitExceed(licenseId);

  if (!limitCheck.isOk || limitCheck.exceeded) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: limitCheck.message || 'Download limit exceeded',
      data: null,
    });
  }

  // /* ------------------ Delay (If Restricted) ------------------ */

  // const restriction = await DownloadRestrict.findOne({
  //   service: 'Envato Elements',
  // });

  // if (restriction?.isRestricted) {
  //   await delay(restriction.delay * 1000);
  // }

  /* ------------------ Cookie Loop ------------------ */

  for (let i = 0; i < 3; i++) {
    const cookieDetails = await generateRandomAccount('envato');

    if (!cookieDetails) break;

    let isCookieWorking = false;

    /* ------------------ URL Processing ------------------ */

    let finalUrl = null;
    const domain = new URL(url).hostname;

    if (domain === 'app.envato.com') {
      finalUrl = url;
    }

    if (domain === 'elements.envato.com') {
      finalUrl = await getRedirectEnvatoLink(url, cookieDetails);
    }

    // console.log('final url -->', finalUrl);

    if (!finalUrl || finalUrl.split('/').length !== 5) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: 'Invalid URL',
        data: null,
      });
    }

    /* ------------------ Generate Request Data ------------------ */

    const credentials = await envatoCookieCredentials(cookieDetails, finalUrl);

    if (!credentials?.payload || !credentials?.headers) {
      continue;
    }

    const { payload, headers, mainURL } = credentials;

    /* ------------------ Make Download Request ------------------ */

    let response;

    try {
      response = await axios({
        method: 'POST',
        url: mainURL,
        headers,
        data: payload,
      });
    } catch (err) {
      continue;
    }

    const data = response?.data;
    // console.log('response data -->', data);

    if (!Array.isArray(data)) continue;

    /* ------------------ Extract Download URL ------------------ */

    const index = data.indexOf('downloadUrl');

    if (index === -1) continue;

    const downloadUrl = data[index + 1];

    if (typeof downloadUrl !== 'string') continue;

    isCookieWorking = true;

    /* ------------------ Save Download ------------------ */
    const contentLicense = payload?.itemUuid || null;

    const download = {
      service: 'Envato Elements',
      content: url,
      contentLicense: contentLicense,
      serviceId: cookieDetails._id,
      licenseId,
      status: 'pending',
    };

    const result = await addDownloadIntoDB(download, req.user);

    if (result) {
      return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Download request successful',
        data: {
          downloadUrl,
          downloadId: result[0]?._id,
        },
      });
    }

    /* ------------------ Inactive Cookie ------------------ */

    if (!isCookieWorking) {
      console.log('Inactive cookie:', cookieDetails._id);

      await updateCookieByIdService(cookieDetails._id, {
        status: 'inactive',
      });
    } else {
      break;
    }
  }

  /* ------------------ Final Fail ------------------ */

  return sendResponse(res, {
    success: false,
    statusCode: 400,
    message: 'Download request is unsuccessful',
    data: null,
  });
});

// Request for getting Story-Blocks Item Code

const getStoryBlockItemCode = async (url) => {
  const browser = await puppeteer.launch(StoryBlocksPuppeteerCredential);
  const page = await browser.newPage();

  try {
    // Set user-agent like mobile
    await page.setUserAgent(
      'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
    );

    // Navigate to page and wait for network + DOM stability
    await page?.goto(url, { waitUntil: 'networkidle2' });

    // Wait until "stockItem" appears in a script tag
    await page?.waitForFunction(
      () => {
        const scripts = Array.from(document.querySelectorAll('script'));
        return scripts.some((script) =>
          script?.innerText?.includes('"stockItem"'),
        );
      },
      { timeout: 60000 },
    );

    // Evaluate and extract stockItem JSON string
    const stockItemData = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      for (let script of scripts) {
        const content = script.innerText;
        const match = content.match(/"stockItem":\s*({[\s\S]*?})/);
        if (match && match[1]) {
          return match[1];
        }
      }
      return null;
    });

    // Extract values from raw string
    if (stockItemData) {
      const idMatch = stockItemData?.match(/"id":\s*(\d+)/);
      const contentClassMatch = stockItemData?.match(
        /"contentClass":"([^"]+)"/,
      );

      const itemCode = idMatch ? idMatch[1] : null;
      const contentClass = contentClassMatch ? contentClassMatch[1] : null;

      await browser.close();
      return { itemCode, contentClass };
    } else {
      console.log('❌ stockItem not found in any script tags.');
      await browser.close();
      return null;
    }
  } catch (error) {
    console.log(
      '🔥 Error in getting item code and content-class:',
      error.message,
    );
    await browser.close();
    return null;
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
    const cookie = await generateRandomAccount('story-blocks');

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
      await updateCookieByIdService(cookie?._id, { status: 'inactive' });
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
  const restriction = await DownloadRestrict?.findOne({
    service: 'Story Blocks',
  });
  // console.log(restriction);

  if (restriction?.isRestricted) {
    const delayInMilliseconds = restriction?.delay * 1000;
    // console.log(
    //   `Task will start after a delay of ${
    //     delayInMilliseconds / 1000
    //   } seconds...`,
    // );

    // Await the delay before proceeding
    await delay(delayInMilliseconds); // Using the delay function
    // console.log('Task started after the delay.');
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

  const { mainURL } = await StoryBlocksCookieCredentials(
    contentClass.toLowerCase(),
    itemCode,
    type.toUpperCase(),
  );

  if (!mainURL) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'MainUrl is required',
      data: null,
    });
  }

  // Make the first HTTP request
  const response = await storyBlocksDownloadRequest(mainURL, cookieDetails);
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
  const downloadUrl = response;

  if (downloadUrl) {
    const download = {
      service: 'Story Blocks',
      content: url,
      contentLicense: null,
      serviceId: cookieDetails?._id,
      licenseId: licenseId,
      status: 'pending',
    };
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

const storyBlocksDownloadRequest = async (mainURL, cookieDetails) => {
  const browser = await puppeteer?.launch(StoryBlocksPuppeteerCredential);

  const page = await browser?.newPage();

  try {
    // Set User-Agent and Referer
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    );

    await page.setExtraHTTPHeaders({
      referer: 'https://www.storyblocks.com/',
    });

    // Set Cookies
    await page.setCookie(
      {
        name: 'VID',
        value: cookieDetails?.cookie,
        domain: '.storyblocks.com',
      },
      {
        name: 'login_session',
        value: cookieDetails?.csrfToken,
        domain: '.storyblocks.com',
      },
    );

    // Now go to the download endpoint
    await page.goto(mainURL, { waitUntil: 'networkidle2' });

    // Try to get JSON content (if rendered)
    const response = await page?.evaluate(() => {
      const preElement = document?.querySelector('pre');
      if (preElement) {
        try {
          return JSON.parse(preElement.innerText);
        } catch (e) {
          return { error: 'Failed to parse JSON' };
        }
      }
      return null;
    });
    await browser.close();

    if (response?.data?.downloadUrl) {
      return response?.data?.downloadUrl;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error in story blocks download request:', error.message);
    await browser.close();
  }
};

// Function for getting the motion array download url
const motionArrayDownloadRequest = async (headers, mainURL) => {
  const browser = await puppeteer?.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--window-size=1920x1080',
    ],
    defaultViewport: null,
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
    } else return false;
  } catch (error) {
    // console.error('Error:', error.message);
    await browser.close();
  }
};

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
  const licenseId = user?.currentMotionArrayLicense;
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
    const cookie = await generateRandomAccount('motion-array');

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
      await updateCookieByIdService(cookie?._id, { status: 'inactive' });
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
    type?.toLowerCase(),
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
      service: 'Motion Array',
      content: url,
      contentLicense: null,
      serviceId: cookieDetails?._id,
      licenseId: licenseId,
      status: 'pending',
    };
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

// download request to freepik official website
export const handleFreePikDownload = catchAsync(async (req, res) => {
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
  // current freepik license of the user
  const licenseId = user?.currentFreepikLicense;
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
    const cookie = await generateRandomAccount('freepik');

    if (!cookie) {
      break;
    }
    let isCookieWorking;
    // Loop for double check the cookie
    for (let j = 0; j < 2; j++) {
      isCookieWorking = await isFreepikCookieValid(cookie);

      if (isCookieWorking) {
        break;
      }
    }

    if (!isCookieWorking) {
      // if cookie is not valid then make it inactive
      await updateCookieByIdService(cookie?._id, { status: 'inactive' });
    }

    if (isCookieWorking) {
      cookieDetails = isCookieWorking;
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

  const { headers, mainURL } = await freepikCookieCredentials(
    cookieDetails,
    url,
    type,
  );

  // console.log("url ==> ", mainURL);
  // console.log('headersssss ==> ', headers);

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
  // console.log('main url', mainURL);
  // console.log('header => ', headers);

  // Make the first HTTP request
  const response = await axios({
    method: 'GET',
    url: mainURL,
    headers: headers,
  });
  // console.log(response?.data);

  if (response?.data?.url) {
    const download = {
      service: 'Freepik',
      content: url,
      contentLicense: null,
      serviceId: cookieDetails?._id,
      licenseId: licenseId,
      status: 'pending',
    };
    const result = await addDownloadIntoDB(download, req.user);

    if (result) {
      return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Download request successful',
        data: { downloadUrl: response?.data?.url, downloadId: result[0]?._id },
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

// Request for getting Freepik Video Quality
export const getFreepikVideoQuality = async (mainURL) => {
  try {
    const headers = {
      'sec-ch-ua':
        '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-arch': '""',
      'sec-ch-ua-bitness': '"64"',
      'sec-ch-ua-full-version': '"131.0.6778.267"',
      'sec-ch-ua-full-version-list':
        '"Google Chrome";v="131.0.6778.267", "Chromium";v="131.0.6778.267", "Not_A Brand";v="24.0.0.0"',
      'sec-ch-ua-mobile': '?1',
      'sec-ch-ua-model': '"Nexus 5"',
      'sec-ch-ua-platform': '"Android"',
      'sec-ch-ua-platform-version': '"6.0"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent':
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
    };
    // Make the HTTP request
    const response = await axios({
      method: 'GET',
      url: mainURL,
      headers: headers,
    });
    // const response = await axios.get(mainURL);
    const $ = cheerio?.load(response?.data);
    // Locate the __NEXT_DATA__ script tag and extract its JSON content
    const nextDataScript = $('#__NEXT_DATA__')?.html();

    if (nextDataScript) {
      const nextData = JSON.parse(nextDataScript);
      // Access the options object
      const options = nextData?.props?.pageProps?.options;
      // console.log('options', options);
      if (options) {
        return options;
      } else {
        return false;
      }
    } else {
      console.log('__NEXT_DATA__ script tag not found.');
      return false;
    }
  } catch (error) {
    console.log('Error in getting data:', error);
    return false;
  }
};

export const getRedirectEnvatoLink = async (url, cookieDetails) => {
  let browser;

  try {
    browser = await puppeteer.launch(EnvatoPuppeteerCredential);
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(120000);
    await page.setDefaultTimeout(120000);

    // Safer blocking
    await page.setDefaultNavigationTimeout(120000);
    await page.setDefaultTimeout(120000);

    // Safer blocking
    await page.setRequestInterception(true);

    page.on('request', (req) => {
      const blocked = ['image', 'media', 'font'];

      if (blocked.includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Set cookie
    await page.setCookie({
      name: 'envatosession',
      value: cookieDetails?.csrfToken,
      domain: '.envato.com',
      path: '/',
      secure: true,
      httpOnly: true,
    });

    // Go to asset
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    // Wait for redirect
    await page.waitForNavigation({
      waitUntil: 'networkidle2',
      timeout: 120000,
    });

    const redirectUrl = page.url();

    console.log('Redirect:', redirectUrl);

    if (redirectUrl.includes('app.envato.com')) {
      return redirectUrl;
    }

    return null;
  } catch (error) {
    console.error('Envato redirect error:', error.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
};

// export const getRedirectEnvatoLink = async (url, cookieDetails) => {
//   let browser;

//   try {
//     browser = await puppeteer.launch(EnvatoPuppeteerCredential);
//     const page = await browser.newPage();

//     // Global timeouts (important for production)
//     await page.setDefaultNavigationTimeout(120000);
//     await page.setDefaultTimeout(120000);

//     // Set cookie before visiting
//     await page.setCookie({
//       name: 'envatosession',
//       value: cookieDetails?.csrfToken,
//       domain: '.envato.com',
//       path: '/',
//       secure: true,
//       httpOnly: true,
//     });

//     // Go to asset page
//     await page.goto(url, {
//       waitUntil: 'domcontentloaded',
//     });

//     // Wait for redirect/navigation
//     await page.waitForNavigation({
//       waitUntil: 'networkidle2',
//       timeout: 120000,
//     });

//     const redirectUrl = page.url();

//     // console.log('Redirect URL:', redirectUrl);

//     // Validate redirect
//     if (redirectUrl?.includes('app.envato.com')) {
//       return redirectUrl;
//     }

//     return null;
//   } catch (error) {
//     console.error('Envato redirect error:', error.message);
//     return null;
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// };

// export const getRedirectEnvatoLink = async (url, cookieDetails) => {
//   let browser;

//   try {
//     browser = await puppeteer.launch(EnvatoPuppeteerCredential);
//     const page = await browser.newPage();

//     // Block heavy resources
//     await page.setRequestInterception(true);

//     page.on('request', (req) => {
//       const blocked = ['image', 'font', 'media', 'stylesheet'];

//       if (blocked.includes(req.resourceType())) {
//         req.abort();
//       } else {
//         req.continue();
//       }
//     });

//     // Set cookie BEFORE visiting
//     await page.setCookie({
//       name: 'envatosession',
//       value: cookieDetails?.csrfToken,
//       domain: '.envato.com',
//       path: '/',
//       secure: true,
//       httpOnly: true,
//     });

//     // Go directly to asset
//     await page.goto(url, {
//       waitUntil: 'domcontentloaded',
//       timeout: 60000,
//     });

//     //  Wait until URL becomes app.envato.com
//     await page.waitForFunction(() => location.hostname === 'app.envato.com', {
//       timeout: 60000,
//     });

//     const redirectUrl = page.url();

//     if (redirectUrl?.includes('app.envato.com')) {
//       return redirectUrl;
//     }

//     return null;
//   } catch (error) {
//     console.error('Envato redirect error:', error.message);
//     return null;
//   } finally {
//     if (browser) await browser.close();
//   }
// };
