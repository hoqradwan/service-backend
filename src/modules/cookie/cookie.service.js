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


// import axios from 'axios';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Get the directory name from the current module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Download content from Envato
// export const downloadContent = async (url, cookie) => {
//   try {
//     // Set up the headers
//     const headers = {
//       'Cookie': cookie,
//       'Access-Control-Allow-Credentials': 'true',
//       'Access-Control-Allow-Origin': 'https://elements.envato.com',
//       'Origin': 'https://elements.envato.com',
//       'Referer': 'https://elements.envato.com/',
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
//       'Sec-Fetch-Dest': 'empty',
//       'Sec-Fetch-Mode': 'no-cors',
//       'Sec-Fetch-Site': 'cross-site',
//       'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
//       'Sec-Ch-Ua-Mobile': '?0',
//       'Sec-Ch-Ua-Platform': '"Windows"',
//       'X-Client-Data': 'CIe2yQEIorbJAQipncoBCOCSywEIkqHLAQibossBCIWgzQEIjafNAQiLqM4B',
//       'Accept': '*/*',
//       'Accept-Encoding': 'gzip, deflate, br, zstd',
//       'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8'
//     };

//     // Make the HTTP request
//     const response = await axios({
//       method: 'GET',
//       url: url,
//       headers: headers,
//       responseType: 'stream' // Important for downloading content
//     });

//     // Get the content type and extension
//     const contentType = response.headers['content-type'];
//     const extension = contentType.split('/')[1] || 'bin';
    
//     // Set up the file path
//     const filePath = path.resolve(__dirname, `downloaded-content.${extension}`);

//     // Save the file
//     response.data.pipe(fs.createWriteStream(filePath));
    
//     return { filePath, message: 'Content downloaded successfully' };
//   } catch (error) {
//     console.error('Error downloading content:', error);
//     throw new Error('Failed to download content');
//   }
// };

// import axios from 'axios';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const downloadContent = async (url, cookie, csrfToken) => {
//   try {
//     // Extract the item ID from the URL
//     const itemId = url.split('-').pop();
// console.log(itemId,"ITEM ID");
//     const apiUrl = `https://elements.envato.com/elements-api/items/${itemId}/download_and_license.json`;

//     const headers = {
//       'Cookie': cookie,
//       'X-CSRF-Token': csrfToken,
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
//       'Referer': url,
//       'Origin': 'https://elements.envato.com',
//       'Accept': 'application/json',
//       'Accept-Language': 'en-US,en;q=0.9',
//       'Content-Type': 'application/json',
//       'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
//       'Sec-Ch-Ua-Mobile': '?0',
//       'Sec-Ch-Ua-Platform': '"Windows"',
//       'Sec-Fetch-Dest': 'empty',
//       'Sec-Fetch-Mode': 'cors',
//       'Sec-Fetch-Site': 'same-origin'
//     };

//     const payload = {
//       licenseType: "project",
//       projectName: "04digitaltoolsbd",
//       searchCorrelationId: "ef84555b-d8fe-46e5-b9db-43026f68d8df"
//     };

//     console.log('Sending request to:', apiUrl);
//     console.log('With headers:', JSON.stringify(headers, null, 2));
//     console.log('With payload:', JSON.stringify(payload, null, 2));

//     const response = await axios.post(apiUrl, payload, {
//       headers,
//       withCredentials: true
//     });

//     console.log('Full response:', JSON.stringify(response.data, null, 2));

//     if (response.data && response.data.data && response.data.data.attributes && response.data.data.attributes.downloadUrl) {
//       const downloadUrl = response.data.data.attributes.downloadUrl;
      
//       console.log('Download URL:', downloadUrl);

//       // Now download the actual content
//       const downloadResponse = await axios({
//         method: 'GET',
//         url: downloadUrl,
//         headers: {
//           ...headers,
//           'Referer': apiUrl
//         },
//         responseType: 'stream'
//       });

//       const contentDisposition = downloadResponse.headers['content-disposition'];
//       let filename = 'downloaded-content';
//       if (contentDisposition) {
//         const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
//         if (filenameMatch) {
//           filename = filenameMatch[1];
//         }
//       }

//       const filePath = path.resolve(__dirname, filename);
//       const writer = fs.createWriteStream(filePath);
      
//       downloadResponse.data.pipe(writer);

//       return new Promise((resolve, reject) => {
//         writer.on('finish', () => resolve({ filePath, message: 'Content downloaded successfully' }));
//         writer.on('error', reject);
//       });
//     } else {
//       console.error('Unexpected response structure:', response.data);
//       throw new Error('Download URL not found in the response');
//     }
//   } catch (error) {
//     console.error('Error downloading content:', error.response ? error.response.data : error.message);
//     throw new Error('Failed to download content');
//   }
// };
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadContent = async (url, cookie, csrfToken) => {
  try {
    // Extract the item ID from the URL
    const itemId = url.split('-').pop();
    console.log(itemId, "ITEM ID");

    const apiUrl = `https://elements.envato.com/elements-api/items/${itemId}/download_and_license.json`;

    const headers = {
      'Cookie': cookie,
      'X-CSRF-Token': csrfToken,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Referer': url,
      'Origin': 'https://elements.envato.com',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Content-Type': 'application/json',
      'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin'
    };

    const payload = {
      licenseType: "project",
      projectName: "04digitaltoolsbd",
      searchCorrelationId: "ef84555b-d8fe-46e5-b9db-43026f68d8df"
    };

    // console.log('Sending request to:', apiUrl);
    // console.log('With headers:', JSON.stringify(headers, null, 2));
    // console.log('With payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(apiUrl, payload, { 
      headers,
      withCredentials: true
    });

     console.log('Full response:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.data && response.data.data.attributes && response.data.data.attributes.downloadUrl) {
      const downloadUrl = response.data.data.attributes.downloadUrl;
      
      console.log('Download URL:', downloadUrl);

      // Now download the actual content
      const downloadResponse = await axios({
        method: 'GET',
        url: downloadUrl,
        headers: {
          ...headers,
          'Referer': apiUrl
        },
        responseType: 'stream'
      });
     
       // Extract the filename from the URL
       const urlParts = url.replace('https://', '').split('/');
      const filenameBase = urlParts.length > 0 ? urlParts[urlParts.length - 1].split('-').slice(0, -1).join('-') : 'downloaded-content';
      
      //console.log(filenameBase,"filename")

      const contentDisposition = downloadResponse.headers['content-disposition'];
      let filename = filenameBase;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const filePath = path.resolve(__dirname, filename);
      const writer = fs.createWriteStream(filePath);
      
      downloadResponse.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve({ filePath, message: 'Content downloaded successfully' }));
        writer.on('error', reject);
      });
    } else {
      console.error('Unexpected response structure:', response.data);
      throw new Error('Download URL not found in the response');
    }
  } catch (error) {
    console.error('Error downloading content:', error.response ? error.response.data : error.message);
    throw new Error('Failed to download content');
  }
};
