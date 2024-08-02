export const cookieCredentials = async (cookieDetails, url) => {
  
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

  return { payload, headers };
}

