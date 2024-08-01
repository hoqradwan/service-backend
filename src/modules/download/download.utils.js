import { getCookieByIdService } from "../cookie/cookie.service.js";

// cookies for download request
// export const getCookie = () => {
//   return "  _elements_session_4=LzU4TWJxUlRScDZac0wzNjRnUUxFMnlRcG5TdUJlVTFpQnlEUFN4QWt4QWRadlM3eGVPYXJUeTNZUXdPS0Q4eHk5cFFqNzRPVHM2aFBNdzNwc00reWZDZmRPZ3ZwVXg5NEJqbjdNV092VVdUNUk2OXlhWXBNQlpqNFBFUVIvZG9LU2hQUzF5c2RGd2IwaThWdHZKN1d0WHVhRTQyL2VYY0NvMndRRjN6cVFnRGIxbWtFalp0ZytOdUxqZEtPeFM5U3BYNE93M25zckkvZzJjemU5NG8wTW1HQ0pIY1pmTExZZ29uYUhVVVFQSVVodXVqQ1FiKzFxRnNSREFzTGtVeG5yY2VtSHpYd25MelVhQjZPUDltSlJvRXZuczJ5OVpkSURrTWVxUmlpUjBvNVVGdUV5a1FsOTJad0RVdGNsdm5MZUtuOGsxZTdFRGhVSlBpeCtNeE5HRzFMNEIzWHk3VkRkaVNtdnVyY0U4YnF4WVp2cUM2L2EvdStPQ1JCUDNhVDVzT3R4V1lzWFFPZ2RxZENqczdaUT09LS1rT2xKL09FeHlqaUxTRjBVeGNDcTNnPT0%3D--fabe04e22c0e1a98808eb95b5d6118b0b0a2d46d";
// };
// cookies for download request
// export const getCSRFToken = () => {
//   return "teYkxcRu3l2hBirahp1itguEBjwDwN5pSve2AQvfBLu4r2iLYnNBIdpgMzT-QY64fM8Ftl1oeXx8tQrmECsJaA";
// };


export const cookieCredentials = async (id, url) => {
  const cookieDetails = await getCookieByIdService(id);
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
    'Cookie': cookie, //must required
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

