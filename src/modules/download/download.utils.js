
// Envato cookie details
export const envatoCookieCredentials = async (cookieDetails, url) => {
  const last = url?.split("/")?.length - 1;
  const itemName = (url?.split("/")[last]);
  const itemCode = itemName?.split("/")[0]?.split("-")[(itemName?.split("/")[0]?.split("-").length) - 1];


  if (!itemCode) {
    return res.status(400).json({ isOk: false, message: 'Invalid url' });
  }

  // Main URL for download request
  const mainURL = `https://elements.envato.com/elements-api/items/${itemCode}/download_and_license.json`;

  const cookie = cookieDetails?.cookie;
  const csrfToken = cookieDetails?.csrfToken;
  const project = cookieDetails?.project;

  // payload for download request
  const payload = {
    licenseType: "project",
    projectName: project,
  }

  // headers for download request
  const headers = {
    'Cookie': `_elements_session_4=${cookie}`, //must required
    'X-CSRF-Token': csrfToken, //must required
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-US,en;q=0.9',
    'Content-Type': 'application/json',
    'Origin': 'https://elements.envato.com',
    'Referer': url,
    'Sec-CH-UA': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
    'Sec-CH-UA-Mobile': '?1',
    'Sec-CH-UA-Platform': '"Android"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
  }

  return { payload, headers, mainURL };
}




// Story-blocks cookie details
export const StoryBlocksCookieCredentials = async (cookieDetails, contentClass, itemCode, type) => {

  if (contentClass === "image") {
    contentClass = "images"
  }

  // Main URL for download request
  const mainURL = `https://www.storyblocks.com/${contentClass}/download-ajax/${itemCode}/${type}`

  const cookie = cookieDetails?.cookie;
  const csrfToken = cookieDetails?.csrfToken;

  // headers for download request
  const headers = {
    'Cookie': `VID=${cookie}; login_session=${csrfToken};`
  }

  return { headers, mainURL };
}


// Motion-array cookie details
export const motionArrayCookieCredentials = async (cookieDetails, url, type) => {

  const last = url?.split("/")?.length - 1;
  let itemName = (url?.trim()?.split("/")[last]);
  if (itemName === "") {
    itemName = (url?.split("/")[last - 1]);
  }
  const itemCode = itemName?.split("/")[0]?.split("-")[(itemName?.split("/")[0]?.split("-").length) - 1];



  if (!itemCode) {
    return res.status(400).json({ isOk: false, message: 'Invalid url' });
  }


  // Main URL for download request
  let mainURL;
  if (type) {
    mainURL = `https://motionarray.com/account/download/${itemCode}/?resolutionFormat=${type}`;
  }
  else {
    mainURL = `https://motionarray.com/account/download/${itemCode}/`;
  }

  const cookie = cookieDetails?.cookie;

  // headers for download request
  const headers = {
    "cookie": `laravel_session=${cookie}`,
  }

  return { headers, mainURL };
}


// Freepik cookie details
export const freepikCookieCredentials = async (cookieDetails, url, type) => {
  // https://www.freepik.com/premium-ai-image/back-school-teacher_289405174.htm#query=university%20teacher&position=6&from_view=keyword&track=ais_hybrid&uuid=be0a0f3b-6619-4190-8827-f58340c4b65e
  // https://www.freepik.com/icon/video-message_5358498#fromView=popular&page=1&position=9&uuid=e558fbe9-2a17-4f71-adfc-016dfcac61f7
  // https://www.freepik.com/animated-icon/email-file_11237480#fromView=popular&page=1&position=31&uuid=9ee6b010-f150-4cf2-9db8-66ef017fd3db
  const last = url?.split("/")?.length - 1;
  let itemName = (url?.trim()?.split("/")[last]);
  if (itemName === "") {
    itemName = (url?.split("/")[last - 1]);
  }
  const itemCode = itemName?.split("/")[0]?.split("-")[(itemName?.split("/")[0]?.split("-").length) - 1];



  if (!itemCode) {
    return res.status(400).json({ isOk: false, message: 'Invalid url' });
  }


  // Main URL for download request
  let mainURL;
  if (type) {
    mainURL = `https://motionarray.com/account/download/${itemCode}/?resolutionFormat=${type}`;
  }
  else {
    mainURL = `https://motionarray.com/account/download/${itemCode}/`;
  }

  const cookie = cookieDetails?.cookie;
  const token = cookieDetails?.csrfToken;

  // headers for download request
  const headers = {
    'Cookie': `GR_REFRESH=${cookie} GR_TOKEN=${token}`
  }

  return { headers, mainURL };
}