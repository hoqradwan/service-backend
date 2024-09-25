
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
export const StoryBlocksCookieCredentials = async (contentClass, itemCode, type) => {

  if (contentClass === "image") {
    contentClass = "images"
  }

  // Main URL for download request
  const mainURL = `https://www.storyblocks.com/${contentClass}/download-ajax/${itemCode}/${type}`

  // const cookie = cookieDetails?.cookie;

  // headers for download request
  const headers = {
    'Cookie': `VID=d12e413278572e8c0f060203f3d40082b5cbc669f91b8fd87ece7c8358b4e183;login_session=81cc60cd9dfe9100b6edbff46dd3e1c98eb24e43bb04d7ff2b3896b7d3eaf7453eaad41b8c13ccc4e5169daf1ead8dd5d5d98e5373b3eaf9cb212006fe7131f4`
  }

  return { headers, mainURL };
}

