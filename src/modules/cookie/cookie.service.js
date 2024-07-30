import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name from the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Download content from Envato
export const downloadContent = async (url, cookie, payload) => {
  try {
    // Set up the headers
    const headers = {
      'Cookie': cookie,
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.9',
      'Content-Type': 'application/json',
      'Origin': 'https://elements.envato.com',
      'Referer': 'https://elements.envato.com/futuristic-gradient-textures-6FTX28T',
      'Sec-CH-UA': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'Sec-CH-UA-Mobile': '?1',
      'Sec-CH-UA-Platform': '"Android"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
      'X-CSRF-Token': '_2FikROJWiVMTThap_JtiGNFF49OCHk7mL4BJ-rip-k10y4U0cavr_8VpDeMeSUKJrWUSaxGHfYCgnrISM0_Og',
      'x-csrf-token-2': 'wpzClsOPWiXCj8Otw405wpvDhHl6bTzDl8OOw599w4jCp0VnY8KFw5tIe8OzwpbCk8OuwrNqEFDDmMOOw4J9aMK2w4omw5XCscOMw73CrgtRbMKqWGUYwqzCsnfDh8KIDEYQ'
    };

    // Define the payload for the first request
    const firstPayload = JSON.stringify({
      licenseType: "project",
      projectName: "04digitaltoolsbd",
      searchCorrelationId: "61964461-3f5c-4eeb-85f7-2548bd03a97c"
    });

    // Make the first HTTP request
    const firstResponse = await axios({
      method: 'POST',
      url: url,
      headers: headers,
      data: firstPayload,
    });
console.log('first response',firstResponse);
    // Extract the download URL from the first response
    const downloadUrl = firstResponse.data.data.attributes.downloadUrl;

    // Make the request to download the file
    const fileResponse = await axios({
      method: 'GET',
      url: downloadUrl,
      headers: headers,
      responseType: 'stream' // Important for downloading content
    });
    console.log('file == response ==',fileResponse);
    // Set up the file path
    const filePath = path.resolve(__dirname, 'downloaded-content.zip'); // Adjust the file extension and path as needed

    // Save the file
    fileResponse.data.pipe(fs.createWriteStream(filePath));

    console.log('Download started, saving to:', filePath);

    return { response: fileResponse, message: 'Content downloaded successfully' };
  } catch (error) {
    console.error('Error downloading content:', error.message);
    throw new Error('Failed to download content');
  }
};
