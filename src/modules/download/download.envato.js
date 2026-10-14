import puppeteer from 'puppeteer-extra';
import pLimit from 'p-limit';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// import genericPool from 'generic-pool';
import { findUserById } from '../user/user.service.js';
import axios from 'axios';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import {
  generateRandomAccount,
  isDailyLimitExceed,
} from './download.controller.js';
import {
  getCookieByIdService,
  updateCookieByIdService,
} from '../cookie/cookie.service.js';
import { envatoCookieCredentials } from './download.utils.js';
import { addDownloadIntoDB, getDownloadById } from './download.service.js';
import { DownloadRestrict } from '../downloadDelay/downloadDelay.model.js';

puppeteer.use(StealthPlugin());

// -----------------------download request for license----------------------------------------------------------------------

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

  /* ------------------ Download License PDF ------------------ */

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

  /* ------------------ Get PDF Binary ------------------ */

  const body = await fileRes.arrayBuffer();

  /* ------------------ Dynamic Filename ------------------ */

  const disposition = fileRes.headers.get('content-disposition');

  let filename = 'license.pdf';

  if (disposition && disposition.includes('filename=')) {
    filename = disposition.split('filename=')[1].replace(/"/g, '');
  }

  /* ------------------ Response Headers ------------------ */

  res.setHeader('Content-Type', 'application/pdf');

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  //  VERY IMPORTANT
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

  /* ------------------ Send PDF ------------------ */

  return res.send(Buffer.from(body));
});

export const getEnvatoSessionToken = async (cookieDetails) => {
  try {
    const mainURL = 'https://account.envato.com/api/public/refresh_id_token';
    // console.log('cerf-->', cookieDetails?.csrfToken);

    const headers = {
      Cookie: `envatosession=${cookieDetails?.csrfToken}`,
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.9',
      'Content-Type': 'application/json',
      'Content-Length': '0',
      Origin: 'https://app.envato.com',
      Referer: 'https://app.envato.com/',
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36',

      'Sec-CH-UA': `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
      'Sec-CH-UA-Mobile': '?1',
      'Sec-CH-UA-Platform': `"Android"`,

      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'X-Client-Version': '3.6.0',
    };

    const response = await axios({
      method: 'POST',
      url: mainURL,
      data: {},
      headers: headers,
    });
    // console.log('response-->', response);

    // 🔥 Extract cookies
    const cookies = response.headers['set-cookie'];
    // console.log('cookies-->', cookies);

    let envatoSessionToken = null;

    if (cookies) {
      const envatoCookie = cookies.find((c) => c.startsWith('envatosession='));

      if (envatoCookie) {
        envatoSessionToken = envatoCookie.split(';')[0].split('=')[1];
      }
    }

    // console.log('Token:', envatoSessionToken);
    return envatoSessionToken;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
};
//-----------------------------------------------------

// ------------------------------------Envato Redirect link-------------------------------------------------

// Credentials for envato puppetear
// export const EnvatoPuppeteerCredential = {
//   headless: 'new',
//   // executablePath: '/usr/bin/chromium-browser',

//   args: [
//     '--no-sandbox',
//     '--disable-setuid-sandbox',
//     '--window-size=1920,1080',
//     '--disable-dev-shm-usage',
//     '--disable-gpu',
//   ],

//   defaultViewport: null,
// };

// let browser; // global reusable browser

// export const getRedirectEnvatoLink = async (url, cookieDetails) => {
//   const timeout = 120000;

//   try {
//     if (!browser) {
//       browser = await puppeteer.launch(EnvatoPuppeteerCredential);
//     }

//     const page = await browser.newPage();

//     await page.setDefaultNavigationTimeout(timeout);
//     await page.setDefaultTimeout(timeout);

//     // block heavy resources
//     await page.setRequestInterception(true);

//     page.on('request', (req) => {
//       const blocked = ['image', 'media', 'font'];
//       if (blocked.includes(req.resourceType())) req.abort();
//       else req.continue();
//     });

//     // cookie
//     if (cookieDetails?.csrfToken) {
//       await page.setCookie({
//         name: 'envatosession',
//         value: cookieDetails.csrfToken,
//         domain: '.envato.com',
//         path: '/',
//         secure: true,
//         httpOnly: true,
//       });
//     }

//     //  STEP 1: goto ONLY (no Promise.all)
//     await page.goto(url, {
//       waitUntil: 'domcontentloaded', //  important fix
//       timeout: timeout,
//     });

//     //  STEP 2: wait for redirect instead of navigation promise
//     await page.waitForFunction(
//       () => window.location.href.includes('app.envato.com'),
//       { timeout: timeout },
//     );

//     // extra stability wait
//     await new Promise((r) => setTimeout(r, 1000));
//     // await page.waitForTimeout(1000);

//     const redirectUrl = page.url();

//     await page.close();

//     if (redirectUrl?.includes('app.envato.com')) {
//       return redirectUrl;
//     }

//     return null;
//   } catch (error) {
//     console.error('Envato redirect error:', error.message);

//     try {
//       await page?.close();
//     } catch {}

//     return null;
//   }
// };

// Limit concurrent Puppeteer tasks to 2 to prevent CPU spikes & Docker memory crashes
const limit = pLimit(2);

// Credentials for envato puppeteer
export const EnvatoPuppeteerCredential = {
  headless: 'new',
  protocolTimeout: 180000, // Prevents protocol timeout crashes (3 minutes)
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--window-size=1920,1080',
    '--disable-dev-shm-usage', // Critical for Docker memory management
    '--disable-gpu',
  ],
  defaultViewport: null,
};

let browser; // global reusable browser instance

export const getRedirectEnvatoLink = async (url, cookieDetails) => {
  // Wrap execution inside p-limit queue to handle high concurrency smoothly
  return limit(async () => {
    const timeout = 120000;
    let page;

    try {
      // Check if global browser is closed or disconnected, and re-launch if necessary
      if (!browser || !browser.connected) {
        try {
          if (browser) await browser.close();
        } catch (e) {
          // Ignore close errors if already dead
        }
        browser = await puppeteer.launch(EnvatoPuppeteerCredential);
      }

      page = await browser.newPage();

      await page.setDefaultNavigationTimeout(timeout);
      await page.setDefaultTimeout(timeout);

      // Block heavy resources to save CPU and speed up navigation
      await page.setRequestInterception(true);

      page.on('request', (req) => {
        const blocked = ['image', 'media', 'font'];
        if (blocked.includes(req.resourceType())) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Set cookie if available
      if (cookieDetails?.csrfToken) {
        await page.setCookie({
          name: 'envatosession',
          value: cookieDetails.csrfToken,
          domain: '.envato.com',
          path: '/',
          secure: true,
          httpOnly: true,
        });
      }

      // STEP 1: Navigate to target URL
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: timeout,
      });

      // STEP 2: Wait for redirect to app.envato.com
      await page.waitForFunction(
        () => window.location.href.includes('app.envato.com'),
        { timeout: timeout },
      );

      // Extra stability wait
      await new Promise((r) => setTimeout(r, 1000));

      const redirectUrl = page.url();

      await page.close();
      page = null;

      if (redirectUrl?.includes('app.envato.com')) {
        return redirectUrl;
      }

      return null;
    } catch (error) {
      console.error('Envato redirect error:', error.message);

      // Safely close page if it's still open
      if (page) {
        try {
          await page.close();
        } catch (e) {
          // suppress cleanup errors
        }
      }

      // If the browser session became corrupted/disconnected, reset it cleanly
      if (
        error.message.includes('Protocol error') ||
        error.message.includes('Target closed') ||
        error.message.includes('Session closed')
      ) {
        try {
          if (browser) await browser.close();
        } catch (e) {}
        browser = null;
      }

      return null;
    }
  });
};

// ------------------------------------------------------------------------------------------------------------

// ------------------- Envato Download--------------------
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

  /* ------------------ URL Validation (before cookie loop) ------------------ */

  let domain;
  try {
    domain = new URL(url).hostname;
  } catch {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Invalid URL',
      data: null,
    });
  }

  if (domain !== 'app.envato.com' && domain !== 'elements.envato.com') {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Invalid URL',
      data: null,
    });
  }

  const cookieDetails = await generateRandomAccount('envato');
  if (!cookieDetails) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'No active accounts available! Try again later.',
      data: null,
    });
  }

  /* ------------------ Download Restrict ------------------ */
  const restriction = await DownloadRestrict.findOne({
    service: 'Envato Elements',
  });

  if (restriction?.isRestricted) {
    await new Promise((resolve) =>
      setTimeout(resolve, restriction.delay * 1000),
    );
  }

  /* ------------------ URL Processing ------------------ */
  let finalUrl = null;
  let envatoSessionToken = null;
  if (domain === 'app.envato.com') {
    finalUrl = url;
  } else if (domain === 'elements.envato.com') {
    //  Get Session

    // Check if session is 30 minutes old
    const THIRTY_MINUTES = 30 * 60 * 1000;
    const now = Date.now();
    const updatedAt = new Date(cookieDetails.updatedAt).getTime();
    const isExpired = now - updatedAt > THIRTY_MINUTES;
    // console.log('Time-->', cookieDetails.account, ' = ', isExpired);
    // Request for new session if isExpired
    if (isExpired) {
      const MAX_ATTEMPTS = 3;
      for (let i = 0; i < MAX_ATTEMPTS; i++) {
        envatoSessionToken = await getEnvatoSessionToken(cookieDetails);
        // console.log('session-->', envatoSessionToken);
        if (envatoSessionToken) {
          break;
        }
      }
      if (envatoSessionToken) {
        cookieDetails.csrfToken = envatoSessionToken;
        // Update in DB
        await updateCookieByIdService(cookieDetails._id, {
          csrfToken: envatoSessionToken,
        });
      } else {
        await updateCookieByIdService(cookieDetails._id, {
          status: 'inactive',
        });
        return sendResponse(res, {
          success: false,
          statusCode: 400,
          message:
            'There was a problem downloading the file! Please try again.',
          data: null,
        });
      }
    }

    finalUrl = await getRedirectEnvatoLink(url, cookieDetails);
    // console.log('Final Url-->', finalUrl);

    if (!finalUrl || finalUrl.split('/').length !== 5) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: 'There was a problem getting the file! Please try again.',
        data: null,
      });
    }
  } else {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Invalid URL! Please provide correct url from envato',
      data: null,
    });
  }

  /* ------------------ Generate Request Data ------------------ */

  const credentials = envatoCookieCredentials(cookieDetails, finalUrl);

  if (!credentials?.mainURL || !credentials?.headers) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Credentials failed! Try again later',
      data: null,
    });
  }

  const { itemUuid, headers, mainURL } = credentials;

  // /* ------------------ Make Download Request ------------------ */

  // let response;

  // try {
  //   response = await axios({
  //     method: 'GET',
  //     url: mainURL,
  //     headers,
  //     timeout: 15_000, // FIX: prevent indefinite hangs
  //   });
  // } catch (err) {
  //   // Network/timeout failure — mark cookie inactive and try next
  //   await updateCookieByIdService(cookieDetails._id, { status: 'inactive' });
  //   return sendResponse(res, {
  //     success: false,
  //     statusCode: 400,
  //     message:
  //       ' Something went wrong! Failed to generate download link! Please try again',
  //     data: null,
  //   });
  // }

  // const data = response?.data;
  // // console.log('Data -->', data);

  // if (!Array.isArray(data)) {
  //   await updateCookieByIdService(cookieDetails._id, {
  //     status: 'inactive',
  //   });

  //   return sendResponse(res, {
  //     success: false,
  //     statusCode: 400,
  //     message:
  //       'Something went wrong! Could not find download link! Please try again',
  //     data: null,
  //   });
  // }

  // /* ------------------ Extract Download URL ------------------ */

  // const index = data.indexOf('downloadUrl');

  // if (index === -1) {
  //   await updateCookieByIdService(cookieDetails._id, {
  //     status: 'inactive',
  //   });

  //   return sendResponse(res, {
  //     success: false,
  //     statusCode: 400,
  //     message: 'Something went wrong! Please try again',
  //     data: null,
  //   });
  // }

  // const downloadUrl = data[index + 1];

  // if (typeof downloadUrl !== 'string') {
  //   return sendResponse(res, {
  //     success: false,
  //     statusCode: 400,
  //     message: 'Something went wrong! Please try again',
  //     data: null,
  //   });
  // }

  // /* ------------------ Save Download ------------------ */
  // const contentLicense = itemUuid || null;
  // const download = {
  //   service: 'Envato Elements',
  //   content: url,
  //   contentLicense,
  //   serviceId: cookieDetails._id,
  //   licenseId,
  //   status: 'pending',
  // };

  // const result = await addDownloadIntoDB(download, req.user);

  // if (!result) {
  //   return sendResponse(res, {
  //     success: false,
  //     statusCode: 400,
  //     message: 'Download request is unsuccessful',
  //     data: null,
  //   });
  // }

  // return sendResponse(res, {
  //   success: true,
  //   statusCode: 200,
  //   message: 'Download request successful',
  //   data: {
  //     downloadUrl,
  //     downloadId: result[0]?._id,
  //   },
  // });

  /* ------------------ Make Download Request with Retry ------------------ */

  let downloadUrl = null;
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios({
        method: 'GET',
        url: mainURL,
        headers,
        timeout: 15_000,
      });

      const data = response?.data;

      // Validate payload structure
      if (Array.isArray(data)) {
        const index = data.indexOf('downloadUrl');

        if (index !== -1 && typeof data[index + 1] === 'string') {
          downloadUrl = data[index + 1];
          break; // Successfully retrieved and validated downloadUrl
        }
      }
    } catch (err) {
      // Log attempt failure if needed, loop will proceed to next retry
    }
  }

  /* ------------------ Handle Loop Exhaustion / Cookie Inactivation ------------------ */

  // If after all retries no valid downloadUrl was obtained
  if (!downloadUrl) {
    await updateCookieByIdService(cookieDetails._id, { status: 'inactive' });

    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message:
        'Something went wrong! Failed to generate download link! Please try again',
      data: null,
    });
  }

  /* ------------------ Save Download ------------------ */

  const contentLicense = itemUuid || null;
  const download = {
    service: 'Envato Elements',
    content: url,
    contentLicense,
    serviceId: cookieDetails._id,
    licenseId,
    status: 'pending',
  };

  const result = await addDownloadIntoDB(download, req.user);

  if (!result) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Download request is unsuccessful',
      data: null,
    });
  }

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Download request successful',
    data: {
      downloadUrl,
      downloadId: result[0]?._id,
    },
  });
});
