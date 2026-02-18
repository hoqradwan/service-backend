import { getFreepikVideoQuality } from './download.controller.js';

// Envato cookie details
export const envatoCookieCredentials = async (cookieDetails, url) => {
  if (url?.split('/').length !== 5) {
    return res.status(400).json({ isOk: false, message: 'Invalid url' });
  }
  const mainURL = `https://app.envato.com/download.data`;

  const itemUuid = url?.split('/')[4];
  const itemType = url?.split('/')[3];

  if (!itemUuid || !itemType) {
    return res.status(400).json({ isOk: false, message: 'Invalid url' });
  }

  const cookie = cookieDetails?.cookie;

  // payload for download requestW
  const payload = {
    itemUuid,
    itemType,
  };

  // headers for download request
  const headers = {
    Cookie: `envatoid=${cookie}`,
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-US,en;q=0.9',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    Origin: 'https://app.envato.com',
    Referer: url,
    'Sec-CH-UA': `"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"`,
    'Sec-CH-UA-Mobile': '?1',
    'Sec-CH-UA-Platform': `"Android"`,
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent':
      'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36',
    Traceparent: '00-0000000000000000d8da331163a6ae06-787c7d13acb2558c-01',
    Tracestate: 'dd=s:1;o:rum',
    'X-Datadog-Origin': 'rum',
    'X-Datadog-Parent-Id': '8681951705118692748',
    'X-Datadog-Sampling-Priority': '1',
    'X-Datadog-Trace-Id': '15625858006894685702',
  };

  return { payload, headers, mainURL };
};

// Story-blocks cookie details
export const StoryBlocksPuppeteerCredential = {
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
};

export const StoryBlocksCookieCredentials = async (
  contentClass,
  itemCode,
  type,
) => {
  if (contentClass === 'image') {
    contentClass = 'images';
  }

  // Main URL for download request
  const mainURL = `https://www.storyblocks.com/${contentClass}/download-ajax/${itemCode}/${type}`;

  return { mainURL };
};

// Motion-array cookie details
export const motionArrayCookieCredentials = async (
  cookieDetails,
  url,
  type,
) => {
  const isExtraThingsExist = url?.split('?');
  const cleanUrl = isExtraThingsExist[0];
  const last = cleanUrl?.split('/')?.length - 1;
  let itemName = cleanUrl?.trim()?.split('/')[last];
  if (itemName === '') {
    itemName = cleanUrl?.split('/')[last - 1];
  }
  const itemCode = itemName?.split('/')[0]?.split('-')[
    itemName?.split('/')[0]?.split('-').length - 1
  ];

  if (!itemCode) {
    return res.status(400).json({ isOk: false, message: 'Invalid url' });
  }

  // Main URL for download request
  let mainURL;
  if (type) {
    mainURL = `https://motionarray.com/account/download/${itemCode}/?resolutionFormat=${type}`;
  } else {
    mainURL = `https://motionarray.com/account/download/${itemCode}/`;
  }

  const cookie = cookieDetails?.cookie;

  // headers for download request
  const headers = {
    cookie: `laravel_session=${cookie}`,
  };

  return { headers, mainURL };
};

// Freepik cookie details
export const freepikCookieCredentials = async (cookieDetails, url, type) => {
  const itemList = url?.trim()?.split('/');
  const content = itemList[3];
  let item = itemList?.[itemList?.length - 1];
  const itemSplit1 = item?.split('#');
  const itemSplit2 = itemSplit1[0]?.split('.htm');
  const itemSplit3 = itemSplit2[0]?.split('_');
  const itemCode = itemSplit3[itemSplit3?.length - 1];
  const cookie = cookieDetails?.cookie?.trim();
  // const csrf_freepik = cookieDetails?.csrf_freepik?.trim();
  const GR_TOKEN = cookieDetails?.GR_TOKEN?.trim();
  const walletId = cookieDetails?.csrfToken?.trim();

  // const token = cookieDetails?.csrfToken?.trim();

  if (!itemCode) {
    // return res.status(400).json({ isOk: false, message: 'Invalid url' });
    return { headers: false, mainURL: false };
  }

  // Main URL for download request
  let mainURL;

  if (content === 'icon' || content === 'animated-icon') {
    mainURL = `https://www.freepik.com/api/icon/download?walletId=${walletId}&optionId=${itemCode}&format=${type}&type=original`;
  } else if (content === 'free-video' || content === 'premium-video') {
    const options = await getFreepikVideoQuality(url);

    if (type === 'original') {
      const optionId = options?.find((option) => option?.isOriginal === true);
      if (!optionId) {
        // return res.status(400).json({ isOk: false, message: 'Invalid url' });
        return { headers: false, mainURL: false };
      } else {
        mainURL = `https://www.freepik.com/api/video/${itemCode}/download?walletId=${walletId}&optionId=${optionId?.id}`;
      }
    } else {
      const optionId = options?.find(
        (option) => option?.quality === type && option?.isOriginal === false,
      );
      if (!optionId) {
        // return res.status(400).json({ isOk: false, message: 'Invalid url' });
        return { headers: false, mainURL: false };
      } else {
        mainURL = `https://www.freepik.com/api/video/${itemCode}/download?walletId=${walletId}&optionId=${optionId?.id}`;
      }
    }
  }
  // (content === "free-photo" || content === "premium-photo"  || content === "free-vector" || content === "premium-vector" || content === "free-psd" || content === "premium-psd")
  else {
    mainURL = `https://www.freepik.com/api/regular/download?walletId=${walletId}&resource=${itemCode}&action=download`;
  }

  // headers for download request
  const headers = {
    Cookie: `GR_REFRESH=${cookie}; GR_TOKEN=${GR_TOKEN};`,
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

  return { headers, mainURL };
};

// Credentials for envato puppetear
export const EnvatoPuppeteerCredential = {
  headless: 'true',
  executablePath:    process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
,

  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--window-size=1920,1080',
    '--disable-dev-shm-usage',
  ],

  defaultViewport: null,
};
