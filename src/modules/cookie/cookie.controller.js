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
import {
  envatoCookieCredentials,
  StoryBlocksPuppeteerCredential,
} from '../download/download.utils.js';
import axios from 'axios';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

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
  const isAccountExist = await getCookieByAccountEmailService(
    data?.account,
    data?.serviceName,
  );
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
  const page = parseInt(req?.query?.page) || 1;
  const limit = parseInt(req?.query?.limit) || 10;

  const cookies = await getAllCookiesService(page, limit);

  // if (cookies.length === 0) {
  //   return sendResponse(res, {
  //     success: false,
  //     statusCode: httpStatus.NOT_FOUND,
  //     message: 'No cookies found',
  //     data: null,
  //   });
  // }

  const totalCookies = await getTotalDocumentCountService();
  const totalPages = Math.ceil(totalCookies / limit);
  const currentPageCookies = cookies?.length;

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

  const service = cookieDetails?.serviceName;
  let isWorking;
  if (service === 'envato') {
    isWorking = await isCookieValid(cookieDetails);
  } else if (service === 'story-blocks') {
    isWorking = await isStoryBlocksCookieValid(cookieDetails);
  } else if (service === 'motion-array') {
    isWorking = await isMotionArrayCookieValid(cookieDetails);
  } else if (service === 'freepik') {
    isWorking = await isFreepikCookieValid(cookieDetails);
  }

  if (isWorking) {
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

// Check if the envato cookie is expired or not
export const isCookieValid = async (cookieDetails) => {
  try {
    const urls = [
      'https://app.envato.com/graphics/229c8d57-e02f-4632-a337-4f7058995a0c',
      'https://app.envato.com/video-templates/08b1fc9f-5236-462c-bc58-5fb623969e5f',
      'https://app.envato.com/photos/5d431fd0-adfb-4b6c-8128-6a470145e148',
      'https://app.envato.com/photos/0c11ec80-6f16-4679-97c2-27f29ffe478e',
      'https://app.envato.com/photos/d422f4df-af74-4a31-af1f-f433310d14fe',
    ];

    // Get a random URL
    const url = urls[Math?.floor(Math?.random() * urls?.length)];

    const { payload, headers, mainURL } = await envatoCookieCredentials(
      cookieDetails,
      url,
    );

    // Make the HTTP request
    const response = await axios({
      method: 'POST',
      url: mainURL,
      headers: headers,
      data: payload,
    });

    if (response) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

// Check if the story-blocks cookie is expired or not
// export const isStoryBlocksCookieValid = async (cookieDetails) => {
//   try {
//     const cookie = cookieDetails?.cookie;
//     const csrfToken = cookieDetails?.csrfToken;

//     const urls = [
//       'https://www.storyblocks.com/video/download-ajax/3541468/HDMOV',
//       'https://www.storyblocks.com/video/download-ajax/3541464/4KMOV',
//       'https://www.storyblocks.com/video/download-ajax/348794725/4KMP4',
//       'https://www.storyblocks.com/video/download-ajax/10937614/HDMOV',
//     ];

//     // Get a random URL
//     const mainURL = urls[Math?.floor(Math?.random() * urls?.length)];

//     // headers for download request
//     const headers = {
//       Cookie: `VID=${cookie}; login_session=${csrfToken};`,
//       'sec-ch-ua':
//         '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
//       'sec-ch-ua-arch': '""',
//       'sec-ch-ua-bitness': '"64"',
//       'sec-ch-ua-full-version': '"131.0.6778.267"',
//       'sec-ch-ua-full-version-list':
//         '"Google Chrome";v="131.0.6778.267", "Chromium";v="131.0.6778.267", "Not_A Brand";v="24.0.0.0"',
//       'sec-ch-ua-mobile': '?1',
//       'sec-ch-ua-model': '"Nexus 5"',
//       'sec-ch-ua-platform': '"Android"',
//       'sec-ch-ua-platform-version': '"6.0"',
//       'sec-fetch-dest': 'empty',
//       'sec-fetch-mode': 'cors',
//       'sec-fetch-site': 'same-origin',
//       'user-agent':
//         'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
//     };

//     // Make the HTTP request
//     const response = await axios({
//       method: 'GET',
//       url: mainURL,
//       headers: headers,
//     });

//     if (response?.data?.data?.downloadUrl) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     return false;
//   }
// };

export const isStoryBlocksCookieValid = async (cookieDetails) => {
  const browser = await puppeteer?.launch(StoryBlocksPuppeteerCredential);
  const page = await browser?.newPage();

  const urls = [
    'https://www.storyblocks.com/video/download-ajax/3541468/HDMOV',
    'https://www.storyblocks.com/video/download-ajax/3541464/4KMOV',
    'https://www.storyblocks.com/video/download-ajax/348794725/4KMP4',
    'https://www.storyblocks.com/video/download-ajax/10937614/HDMOV',
  ];

  try {
    const cookie = cookieDetails?.cookie;
    const csrfToken = cookieDetails?.csrfToken;
    // Get a random URL
    const mainURL = urls[Math?.floor(Math?.random() * urls?.length)];

    // Set User-Agent and Referer
    await page?.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    );

    await page?.setExtraHTTPHeaders({
      referer: 'https://www.storyblocks.com/',
    });

    // Set Cookies
    await page.setCookie(
      {
        name: 'VID',
        value: cookie,
        domain: '.storyblocks.com',
      },
      {
        name: 'login_session',
        value: csrfToken,
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
          return JSON?.parse(preElement.innerText);
        } catch (e) {
          return { error: 'Failed to parse JSON' };
        }
      }
      return null;
    });

    await browser?.close();

    if (response?.data?.downloadUrl) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error:', error?.message);
    await browser?.close();
  }
};

export const isMotionArrayCookieValid = async (cookieDetails) => {
  const browser = await puppeteer.launch({
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
  const page = await browser.newPage();
  try {
    const cookie = cookieDetails?.cookie;

    const urls = [
      'https://motionarray.com/account/download/2721820/',
      'https://motionarray.com/account/download/2743739/',
      'https://motionarray.com/account/download/2790964/',
      'https://motionarray.com/account/download/1980682/',
      'https://motionarray.com/account/download/1980655/',
    ];

    const mainURL = urls[Math.floor(Math.random() * urls.length)];

    await page.setExtraHTTPHeaders({
      cookie: `laravel_session=${cookie}`,
    });

    await page.goto(mainURL, { waitUntil: 'networkidle2' });

    const signedUrl = await page.evaluate(() => {
      const preElement = document.querySelector('pre');
      if (preElement) {
        const jsonData = JSON.parse(preElement.innerText);
        return jsonData?.signed_url;
      }
      return null;
    });

    await browser.close();

    return signedUrl ? true : false;
  } catch (error) {
    await browser.close();
    return false;
  }
};
// Check if the story-blocks cookie is expired or not
// export const isMotionArrayCookieValid = async (cookieDetails) => {
//   const browser = await puppeteer?.launch({
//     headless: false, // Run in headless mode
//   });
//   const page = await browser?.newPage();
//   try {
//     const cookie = cookieDetails?.cookie;

//     const urls = [
//       'https://motionarray.com/account/download/2721820/',
//       'https://motionarray.com/account/download/2743739/',
//       'https://motionarray.com/account/download/2790964/',
//       'https://motionarray.com/account/download/1980682/',
//       'https://motionarray.com/account/download/1980655/',
//     ];

//     // Get a random URL
//     const mainURL = urls[Math?.floor(Math?.random() * urls?.length)];

//     // Set extra headers including cookie
//     await page?.setExtraHTTPHeaders({
//       cookie: `laravel_session=${cookie}`,
//     });

//     // Navigate to the target page
//     await page?.goto(mainURL, { waitUntil: 'networkidle2' });

//     // Extract the signed_url from the JSON
//     const signedUrl = await page?.evaluate(() => {
//       const preElement = document?.querySelector('pre');
//       if (preElement) {
//         const jsonData = JSON?.parse(preElement.innerText);
//         return jsonData?.signed_url;
//       }
//       return null;
//     });

//     // Close the browser
//     await browser?.close();

//     if (signedUrl) {
//       return true;
//     } else {
//       await browser?.close();
//       return false;
//     }
//   } catch (error) {
//     await browser?.close();
//     return false;
//   }
// };

// Check if the Freepik cookie is expired or not

export const isFreepikCookieValid = async (cookieDetails) => {
  try {
    const cookie = cookieDetails?.cookie?.trim();

    const { GR_TOKEN } = await generateGRToken(cookie);

    let updatedCookieDetails;
    if (GR_TOKEN) {
      cookieDetails = cookieDetails.toObject();
      updatedCookieDetails = { ...cookieDetails, GR_TOKEN };
      return updatedCookieDetails;
    } else {
      return false;
    }

    // const urls = [
    //   `https://www.freepik.com/api/video/3762321/download?optionId=19242183`,
    // ];
    // Get a random URL
    // const mainURL = urls[Math?.floor(Math?.random() * urls?.length)];

    // const headers = {
    //   Cookie: `GR_REFRESH=${cookie}; GR_TOKEN=${GR_TOKEN};`,
    //   'sec-ch-ua':
    //     '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    //   'sec-ch-ua-arch': '""',
    //   'sec-ch-ua-bitness': '"64"',
    //   'sec-ch-ua-full-version': '"131.0.6778.267"',
    //   'sec-ch-ua-full-version-list':
    //     '"Google Chrome";v="131.0.6778.267", "Chromium";v="131.0.6778.267", "Not_A Brand";v="24.0.0.0"',
    //   'sec-ch-ua-mobile': '?1',
    //   'sec-ch-ua-model': '"Nexus 5"',
    //   'sec-ch-ua-platform': '"Android"',
    //   'sec-ch-ua-platform-version': '"6.0"',
    //   'sec-fetch-dest': 'empty',
    //   'sec-fetch-mode': 'cors',
    //   'sec-fetch-site': 'same-origin',
    //   'user-agent':
    //     'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
    // };

    // Make the HTTP request
    // const response = await axios({
    //   method: 'GET',
    //   url: mainURL,
    //   headers: headers,
    // });

    // if (response?.data?.url) {
    //   return updatedCookieDetails;
    // } else {
    //   return false;
    // }
  } catch (error) {
    // console.log(error);
    return false;
  }
};

export const generateGRToken = async (cookie) => {
  try {
    const mainURL =
      'https://www.freepik.com/api/social/like?type=photo&id=32637779';

    const headers = {
      Cookie: `GR_REFRESH=${cookie};`,
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

    if (response?.headers) {
      const setCookieArray = response?.headers['set-cookie'];
      const cookies = Object?.fromEntries(
        setCookieArray?.map((cookie) => {
          const [key, value] = cookie.split(';')[0].split('=');
          return [key, value];
        }),
      );
      // const csrf_freepik = cookies['csrf_freepik'];
      const GR_TOKEN = cookies['GR_TOKEN'];

      if (GR_TOKEN) {
        return { GR_TOKEN };
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    // console.log(error);

    return false;
  }
};
