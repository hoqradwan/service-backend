// import axios from 'axios';
// import { getCookie } from './cookie.utils.js';

// export const downloadFromEnvato = async (url) => {
//   try {
//     const cookie = getCookie();
//     const response = await axios.get(url, {
//       headers: {
//         'Cookie': cookie,
//         'Access-Control-Allow-Credentials': 'true',
//         'Access-Control-Allow-Origin': 'https://elements.envato.com',
//         'Origin': 'https://elements.envato.com',
//         'Referer': 'https://elements.envato.com/',
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
//         'Sec-Fetch-Dest': 'empty',
//         'Sec-Fetch-Mode': 'no-cors',
//         'Sec-Fetch-Site': 'cross-site',
//         'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
//         'Sec-Ch-Ua-Mobile': '?0',
//         'Sec-Ch-Ua-Platform': '"Windows"',
//         'X-Client-Data': 'CIe2yQEIorbJAQipncoBCOCSywEIkqHLAQibossBCIWgzQEIjafNAQiLqM4B',
//         'Accept': '*/*',
//         'Accept-Encoding': 'gzip, deflate, br, zstd',
//         'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8'
//       },
//       responseType: 'arraybuffer'
//     });
// console.log(response,"response")
//     const contentType = response.headers['content-type'];
//     const disposition = response.headers['content-disposition'];
//     const filename = disposition ? disposition.split('filename=')[1].replace(/"/g, '') : 'downloaded-file';

//     return {
//       data: response.data,
//       mimeType: contentType,
//       filename,
//     };
//   } catch (error) {
//     console.error('Error downloading from Envato:', error);
//     return null;
//   }
// };


import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name from the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Download content from Envato
export const downloadContent = async (url, cookie) => {
  try {
    // Set up the headers
    const headers = {
      'Cookie': cookie,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': 'https://elements.envato.com',
      'Origin': 'https://elements.envato.com',
      'Referer': 'https://elements.envato.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'X-Client-Data': 'CIe2yQEIorbJAQipncoBCOCSywEIkqHLAQibossBCIWgzQEIjafNAQiLqM4B',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8'
    };

    // Make the HTTP request
    const response = await axios({
      method: 'GET',
      url: url,
      headers: headers,
      responseType: 'stream' // Important for downloading content
    });

    // Get the content type and extension
    const contentType = response.headers['content-type'];
    const extension = contentType.split('/')[1] || 'bin';
    
    // Set up the file path
    const filePath = path.resolve(__dirname, `downloaded-content.${extension}`);

    // Save the file
    response.data.pipe(fs.createWriteStream(filePath));
    
    return { filePath, message: 'Content downloaded successfully' };
  } catch (error) {
    console.error('Error downloading content:', error);
    throw new Error('Failed to download content');
  }
};

