import puppeteer from 'puppeteer-extra';
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
// ---------------------------------------------------------------

// ---------------Envato Session Token-------------
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
    console.error('Error:', error);
    return null;
  }
};
//-----------------------------------------------------

// ------------------------------------Envato Redirect link-------------------------------------------------

// Credentials for envato puppetear
export const EnvatoPuppeteerCredential = {
  headless: 'new',
  // executablePath: '/usr/bin/chromium-browser',

  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--window-size=1920,1080',
    '--disable-dev-shm-usage',
    '--disable-gpu',
  ],

  defaultViewport: null,
};

let browser; // global reusable browser

export const getRedirectEnvatoLink = async (url, cookieDetails) => {
  const timeout = 120000;
  try {
    // Reuse browser (no cold start every time)
    if (!browser) {
      browser = await puppeteer.launch(EnvatoPuppeteerCredential);
    }

    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(timeout);
    await page.setDefaultTimeout(timeout);

    //  Block heavy resources (faster + stable)
    await page.setRequestInterception(true);

    page.on('request', (req) => {
      const blocked = ['image', 'media', 'font'];

      if (blocked.includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    //  Set cookie (basic)
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

    // Proper navigation handling (fixes missing redirect)
    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle2',
        timeout: timeout,
      }),
      page.goto(url),
    ]);

    // Then ensure final redirect reached
    await page.waitForFunction(
      () => window.location.href.includes('app.envato.com'),
      { timeout: 10000 },
    );

    const redirectUrl = page.url();

    await page.close(); // important (avoid memory leak)

    if (redirectUrl?.includes('app.envato.com')) {
      return redirectUrl;
    }

    return null;
  } catch (error) {
    console.error('Envato redirect error:', error.message);
    return null;
  }
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
        console.log('session-->', envatoSessionToken);
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
    console.log('Final Url-->', finalUrl);

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

  /* ------------------ Make Download Request ------------------ */

  let response;

  try {
    response = await axios({
      method: 'GET',
      url: mainURL,
      headers,
      timeout: 15_000, // FIX: prevent indefinite hangs
    });
  } catch (err) {
    // Network/timeout failure — mark cookie inactive and try next
    await updateCookieByIdService(cookieDetails._id, { status: 'inactive' });
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Something went wrong! Please try again',
      data: null,
    });
  }

  const data = response?.data;
  // console.log('Data -->', data);

  if (!Array.isArray(data)) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Something went wrong! Please try again',
      data: null,
    });
  }

  /* ------------------ Extract Download URL ------------------ */

  const index = data.indexOf('downloadUrl');

  if (index === -1) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Something went wrong! Please try again',
      data: null,
    });
  }

  const downloadUrl = data[index + 1];

  if (typeof downloadUrl !== 'string') {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Something went wrong! Please try again',
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

// -----------------------------------------------

// =====================================================================================
// ====================== Envato Alternative ============================
// ─── Config ───────────────────────────────────────────────────────────────────
// const CONFIG = {
//   pool: {
//     min: 2,
//     max: 5,
//     acquireTimeoutMillis: 35000,
//     idleTimeoutMillis: 120000,
//     evictionRunIntervalMillis: 30000,
//     testOnBorrow: true,
//   },
//   queue: {
//     maxSize: 50,
//     timeoutMs: 30000,
//   },
//   navigation: {
//     timeoutMs: 120000, // ← Max time for the whole goto() call
//     redirectTimeoutMs: 80000, // ← Max time to wait for app.envato.com redirect
//   },
// };

// // ─── Puppeteer Launch Args (mirrors your EnvatoPuppeteerCredential) ────────────
// const PUPPETEER_ARGS = [
//   '--no-sandbox',
//   '--disable-setuid-sandbox',
//   '--disable-dev-shm-usage',
//   '--disable-gpu',
//   '--disable-extensions',
//   '--disable-background-networking',
//   '--disable-default-apps',
//   '--disable-sync',
//   '--disable-translate',
//   '--hide-scrollbars',
//   '--mute-audio',
//   '--safebrowsing-disable-auto-update',
//   '--disable-background-timer-throttling',
//   '--disable-backgrounding-occluded-windows',
//   '--disable-renderer-backgrounding',
// ];

// // ─── Browser Pool (initialized once on module load) ───────────────────────────
// const browserPool = genericPool.createPool(
//   {
//     create: async () => {
//       console.log('Creating browser...');
//       const browser = await puppeteer.launch({
//         headless: true,
//         args: PUPPETEER_ARGS,
//       });

//       browser._isBeingDestroyed = false;

//       browser.on('disconnected', () => {
//         console.warn('Browser disconnected unexpectedly');
//         if (browser._isBeingDestroyed) return;
//         browser._isBeingDestroyed = true;
//         try {
//           if (browserPool.isBorrowedResource(browser)) {
//             browserPool.destroy(browser).catch(() => {});
//           }
//         } catch (_) {}
//       });

//       console.log('Browser ready');
//       return browser;
//     },

//     destroy: async (browser) => {
//       console.log('Destroying browser');
//       browser._isBeingDestroyed = true;
//       await browser.close().catch(() => {});
//     },

//     validate: async (browser) => {
//       try {
//         if (!browser.isConnected()) return false;
//         await browser.version();
//         return true;
//       } catch {
//         return false;
//       }
//     },
//   },
//   CONFIG.pool,
// );

// // ─── Graceful Shutdown ────────────────────────────────────────────────────────
// const shutdown = async () => {
//   console.log('Shutting down browser pool...');
//   await browserPool.drain();
//   await browserPool.clear();
// };
// process.on('SIGINT', shutdown);
// process.on('SIGTERM', shutdown);

// // ─── Request Queue ────────────────────────────────────────────────────────────
// class RequestQueue {
//   constructor() {
//     this.queue = [];
//     this.processing = new Set();
//     this.stats = { completed: 0, failed: 0, rejected: 0 };
//   }

//   enqueue(task) {
//     return new Promise((resolve, reject) => {
//       if (this.queue.length >= CONFIG.queue.maxSize) {
//         this.stats.rejected++;
//         console.warn(`Queue full (${CONFIG.queue.maxSize}), rejecting request`);
//         return reject(new Error('Queue is full. Please try again later.'));
//       }

//       const timer = setTimeout(() => {
//         const idx = this.queue.findIndex((item) => item.resolve === resolve);
//         if (idx !== -1) {
//           this.queue.splice(idx, 1);
//           this.stats.rejected++;
//           reject(new Error('Request timed out waiting in queue'));
//         }
//       }, CONFIG.queue.timeoutMs);

//       this.queue.push({ task, resolve, reject, timer, enqueuedAt: Date.now() });
//       console.log(`Queued (queue size: ${this.queue.length})`);
//       this._process();
//     });
//   }

//   async _process() {
//     if (this.queue.length === 0) return;

//     let browser;
//     try {
//       browser = await browserPool.acquire();
//     } catch {
//       return;
//     }

//     const item = this.queue.shift();
//     if (!item) {
//       browserPool.release(browser);
//       return;
//     }

//     clearTimeout(item.timer);
//     const waitTime = Date.now() - item.enqueuedAt;
//     console.log(`Processing (waited ${waitTime}ms in queue)`);

//     this.processing.add(item);

//     try {
//       const result = await item.task(browser);
//       this.stats.completed++;
//       item.resolve(result);
//     } catch (err) {
//       this.stats.failed++;
//       item.reject(err);
//     } finally {
//       this.processing.delete(item);
//       if (!browser.isConnected()) {
//         console.warn('Browser died during task, destroying...');
//         browserPool.destroy(browser).catch(() => {});
//       } else {
//         browserPool.release(browser);
//       }
//       this._process();
//     }
//   }

//   getStats() {
//     return {
//       ...this.stats,
//       queueLength: this.queue.length,
//       activeRequests: this.processing.size,
//       poolSize: browserPool.size,
//       poolAvailable: browserPool.available,
//     };
//   }
// }

// const requestQueue = new RequestQueue();

// // ─── Core Task ────────────────────────────────────────────────────────────────
// const createEnvatoTask = (url, cookieDetails) => async (browser) => {
//   const context = await browser.createBrowserContext();
//   let page = null;

//   try {
//     page = await context.newPage();

//     await page.setRequestInterception(true);
//     page.on('request', (req) => {
//       const blocked = [
//         'image',
//         'media',
//         'font',
//         'stylesheet',
//         'ping',
//         'websocket',
//       ];
//       blocked.includes(req.resourceType()) ? req.abort() : req.continue();
//     });

//     if (cookieDetails?.csrfToken) {
//       await page.setCookie({
//         name: 'envatosession',
//         value: cookieDetails.csrfToken,
//         domain: '.envato.com',
//         path: '/',
//         secure: true,
//         httpOnly: true,
//         sameSite: 'Lax',
//       });
//     }

//     const redirectUrl = await new Promise((resolve, reject) => {
//       // ✅ This is the ONLY timeout that matters — how long to wait for
//       // the redirect to app.envato.com, not for the page to fully load
//       const timeout = setTimeout(
//         () => reject(new Error('Redirect timeout: app.envato.com not reached')),
//         CONFIG.navigation.redirectTimeoutMs, // 30s — plenty for any file type
//       );

//       const cleanup = (result) => {
//         clearTimeout(timeout);
//         page.off('framenavigated', onNav);
//         resolve(result);
//       };

//       const onNav = (frame) => {
//         if (frame === page.mainFrame()) {
//           const currentUrl = frame.url();
//           // ✅ Resolves the moment redirect fires — doesn't wait for
//           // video/audio player, thumbnails, or any heavy content to load
//           if (currentUrl.includes('app.envato.com')) cleanup(currentUrl);
//         }
//       };

//       page.on('framenavigated', onNav);

//       page
//         .goto(url, {
//           waitUntil: 'domcontentloaded',
//           timeout: CONFIG.navigation.timeoutMs, // 60s nav timeout (safety net)
//         })
//         .catch((err) => {
//           const ignored = [
//             'net::ERR_ABORTED',
//             'Navigation timeout',
//             'net::ERR_FAILED',
//           ];
//           if (!ignored.some((msg) => err.message.includes(msg))) {
//             clearTimeout(timeout);
//             reject(err);
//           }
//         });
//     });

//     return redirectUrl?.includes('app.envato.com') ? redirectUrl : null;
//   } finally {
//     if (page && !page.isClosed()) await page.close().catch(() => {});
//     await context.close().catch(() => {});
//   }
// };

// // ─── Public API (same signature as your original) ─────────────────────────────
// export const getRedirectEnvatoLink = async (url, cookieDetails) => {
//   try {
//     return await requestQueue.enqueue(createEnvatoTask(url, cookieDetails));
//   } catch (err) {
//     console.error('Envato redirect error:', err.message);
//     return null; // ← returns null just like your original on failure
//   }
// };

// // Optional: use in a /health endpoint
// export const getQueueStats = () => requestQueue.getStats();

// // Envato Download Request -------------------------------------------------------------------------------
// export const handleEnvatoDownload = catchAsync(async (req, res) => {
//   const { url } = req.body;
//   const userId = req?.user?.id;

//   /* ------------------ User Validation ------------------ */

//   if (!userId) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: "Couldn't generate user id",
//       data: null,
//     });
//   }

//   const user = await findUserById(userId);

//   if (!user) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: "Couldn't find the user",
//       data: null,
//     });
//   }

//   const licenseId = user.currentLicense;

//   if (!licenseId) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: 'You do not have a license activated',
//       data: null,
//     });
//   }

//   /* ------------------ Limit Check ------------------ */

//   const limitCheck = await isDailyLimitExceed(licenseId);

//   if (!limitCheck.isOk || limitCheck.exceeded) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: limitCheck.message || 'Download limit exceeded',
//       data: null,
//     });
//   }

//   /* ------------------ URL Validation (before cookie loop) ------------------ */

//   let domain;
//   try {
//     domain = new URL(url).hostname;
//   } catch {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: 'Invalid URL',
//       data: null,
//     });
//   }

//   if (domain !== 'app.envato.com' && domain !== 'elements.envato.com') {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: 'Invalid URL',
//       data: null,
//     });
//   }

//   const cookieDetails = await generateRandomAccount('envato');
//   if (!cookieDetails) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: 'No active accounts available! Try again later.',
//       data: null,
//     });
//   }
//   /* ------------------ URL Processing ------------------ */
//   let finalUrl = null;
//   let envatoSessionToken = null;

//   if (domain === 'app.envato.com') {
//     finalUrl = url;
//   } else if (domain === 'elements.envato.com') {
//     //  Get Session
//     // Check if session is 30 minutes old
//     const THIRTY_MINUTES = 30 * 60 * 1000;
//     const now = Date.now();
//     const updatedAt = new Date(cookieDetails.updatedAt).getTime();
//     const isExpired = now - updatedAt > THIRTY_MINUTES;
//     // console.log('Time-->', cookieDetails.account, ' = ', isExpired);

//     // Request for new session if isExpired
//     if (isExpired) {
//       const MAX_ATTEMPTS = 3;
//       for (let i = 0; i < MAX_ATTEMPTS; i++) {
//         envatoSessionToken = await getEnvatoSessionToken(cookieDetails);
//         // console.log('session-->', envatoSessionToken);
//         if (envatoSessionToken) {
//           break;
//         }
//       }
//       if (envatoSessionToken) {
//         cookieDetails.csrfToken = envatoSessionToken;
//         // Update in DB
//         await updateCookieByIdService(cookieDetails._id, {
//           csrfToken: envatoSessionToken,
//         });
//       } else {
//         await updateCookieByIdService(cookieDetails._id, {
//           status: 'inactive',
//         });
//         return sendResponse(res, {
//           success: false,
//           statusCode: 400,
//           message:
//             'There was a problem downloading the file! Please try again.',
//           data: null,
//         });
//       }
//     }

//     finalUrl = await getRedirectEnvatoLink(url, cookieDetails);
//     // console.log('Final Url-->', finalUrl);

//     if (!finalUrl || finalUrl.split('/').length !== 5) {
//       return sendResponse(res, {
//         success: false,
//         statusCode: 400,
//         message: 'There was a problem getting the file! Please try again.',
//         data: null,
//       });
//     }
//   } else {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: 'Invalid URL! Please provide correct url from envato',
//       data: null,
//     });
//   }

//   /* ------------------ Generate Request Data ------------------ */

//   const credentials = envatoCookieCredentials(cookieDetails, finalUrl);

//   if (!credentials?.mainURL || !credentials?.headers) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: 'Credentials failed! Try again later',
//       data: null,
//     });
//   }

//   const { itemUuid, headers, mainURL } = credentials;

//   /* ------------------ Make Download Request ------------------ */

//   let response;

//   try {
//     response = await axios({
//       method: 'GET',
//       url: mainURL,
//       headers,
//       timeout: 15_000, // FIX: prevent indefinite hangs
//     });
//   } catch (err) {
//     // Network/timeout failure — mark cookie inactive and try next
//     await updateCookieByIdService(cookieDetails._id, { status: 'inactive' });
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: 'Something went wrong! Please try again',
//       data: null,
//     });
//   }

//   const data = response?.data;
//   // console.log('Data -->', data);

//   if (!Array.isArray(data)) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: 'Something went wrong! Please try again',
//       data: null,
//     });
//   }

//   /* ------------------ Extract Download URL ------------------ */

//   const index = data.indexOf('downloadUrl');

//   if (index === -1) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: 'Something went wrong! Please try again',
//       data: null,
//     });
//   }

//   const downloadUrl = data[index + 1];

//   if (typeof downloadUrl !== 'string') {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: 'Something went wrong! Please try again',
//       data: null,
//     });
//   }

//   /* ------------------ Save Download ------------------ */
//   const contentLicense = itemUuid || null;
//   const download = {
//     service: 'Envato Elements',
//     content: url,
//     contentLicense,
//     serviceId: cookieDetails._id,
//     licenseId,
//     status: 'pending',
//   };

//   const result = await addDownloadIntoDB(download, req.user);

//   if (!result) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: 'Download request is unsuccessful',
//       data: null,
//     });
//   }

//   return sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'Download request successful',
//     data: {
//       downloadUrl,
//       downloadId: result[0]?._id,
//     },
//   });
// });
// =====================================================================================
// ====================== Envato Alternative End============================
