import { getFreepikVideoQuality } from "./download.controller.js";

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

  const isExtraThingsExist = url?.split("?")
  const cleanUrl = isExtraThingsExist[0];
  const last = cleanUrl?.split("/")?.length - 1;
  let itemName = (cleanUrl?.trim()?.split("/")[last]);
  if (itemName === "") {
    itemName = (cleanUrl?.split("/")[last - 1]);
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

  const itemList = url?.trim()?.split("/")
  const content = itemList[3];
  let item = itemList?.[itemList?.length - 1];
  const itemSplit1 = item?.split("#");
  const itemSplit2 = itemSplit1[0]?.split(".htm");
  const itemSplit3 = itemSplit2[0]?.split("_");
  const itemCode = itemSplit3[itemSplit3?.length - 1];
  const cookie = cookieDetails?.cookie?.trim();
  // const token = cookieDetails?.csrfToken?.trim();

  if (!itemCode) {
    // return res.status(400).json({ isOk: false, message: 'Invalid url' });
    return { headers: false, mainURL: false };
  }

  // Main URL for download request
  let mainURL;

  if (content === "icon" || content === "animated-icon") {
    mainURL = `https://www.freepik.com/api/icon/download?optionId=${itemCode}&format=${type}&type=original`
  }

  else if (content === "free-video" || content === "premium-video") {

    const options = await getFreepikVideoQuality(url);

    if (type === "original") {
      const optionId = options?.find(option => option?.isOriginal === true)
      if (!optionId) {
        // return res.status(400).json({ isOk: false, message: 'Invalid url' });
        return { headers: false, mainURL: false };
      }
      else {
        mainURL = `https://www.freepik.com/api/video/${itemCode}/download?optionId=${optionId?.id}`
      }

    }
    else {

      const optionId = options?.find(option => option?.quality === type && option?.isOriginal === false)
      if (!optionId) {
        // return res.status(400).json({ isOk: false, message: 'Invalid url' });
        return { headers: false, mainURL: false };
      }
      else {
        mainURL = `https://www.freepik.com/api/video/${itemCode}/download?optionId=${optionId?.id}`
      }
    }

  }
  // (content === "free-photo" || content === "premium-photo"  || content === "free-vector" || content === "premium-vector" || content === "free-psd" || content === "premium-psd")
  else {
    mainURL = `https://www.freepik.com/api/regular/download?resource=${itemCode}&action=download`
  }


  // headers for download request
  const headers = {
    // 'Cookie': `GR_REFRESH=${cookie}; GR_TOKEN=${token}`
    'Cookie': `${cookie}`
  }

  return { headers, mainURL };
}
