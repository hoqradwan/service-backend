import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { addDownloadIntoDB, getMyDownloadsFromDB } from './download.service.js';
import axios from 'axios';
import { cookieCredentials } from './download.utils.js';

export const addDownload = catchAsync(async (req, res) => {
  const result = await addDownloadIntoDB(req.body, req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Item is downloaded successfully.',
    data: result,
  });
});
export const getMyDownloads = catchAsync(async (req, res) => {
  const result = await getMyDownloadsFromDB(req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'My all downloads are retrieved successfully.',
    data: result,
  });
});



import { getRandomAccountService, getTotalDocumentCountService } from '../cookie/cookie.service.js';

export const handleDownload = async (req, res) => {
  try {
    console.log("hitting");
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ isOk: false, message: 'URL is required' });
    }
    const lastIndex = (url?.split("/")[3]?.split("-")?.length) - 1;
    const itemCode = url?.split("/")[3]?.split("-")[lastIndex];

    if ((((url?.split("/").length)) !== 4) || !itemCode) {
      return res.status(400).json({ isOk: false, message: 'Invalid url' });
    }

    // credentials for download request
    const mainURL = `https://elements.envato.com/elements-api/items/${itemCode}/download_and_license.json`;

    const { payload, headers } = await cookieCredentials("66ab8571f9960ae1fefea5d9", url);

    if (!payload) {
      return res.status(400).json({ isOk: false, message: 'Payload is required' });
    }
    if (!headers) {
      return res.status(400).json({ isOk: false, message: 'Headers is required' });
    }

    // Make the first HTTP request
    const response = await axios({
      method: 'POST',
      url: mainURL,
      headers: headers,
      data: payload,
    });
    if (!response) {
      return res.status(400).json({ isOk: false, message: 'Item code is not valid' })
    }
    // console.log('download link response', response.data);
    // Extract the download URL from the first response
    const downloadUrl = response?.data?.data?.attributes?.downloadUrl;
    console.log("download link", downloadUrl);

    if (downloadUrl) {
      return res.status(200).json({
        isOk: true,
        message: "Download request successful",
        downloadUrl
      });
    }
    else {
      return res.status(400).json({
        isOk: false,
        message: "Download request is unsuccessful",
      });
    }


  } catch (error) {
    console.error('Error handling download:', error);
    res.status(500).json({ isOk: false, message: 'Internal server error' });
  }
};


// Random account generator 
export const generateRandomAccount = async () => {
  try {
    const count = await getTotalDocumentCountService();
    console.log("total accounts = ", count);

    // Generating a random number 
    const randomIndex = Math?.floor(Math?.random() * count);

    // Getting the random account
    const randomAccount = await getRandomAccountService(randomIndex);
    return randomAccount;
  } catch (error) {
    console.error('Error fetching random account:', error);
  }
}