import axios from 'axios';
import { getCookie, getHeaders, getPayload } from './download.utils.js';

export const handleDownload = async (req, res) => {
  try {
    console.log("hitting");
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ isOk: false, message: 'URL is required' });
    }
    const lastIndex = (url?.split("/")[3]?.split("-")?.length) - 1;
    const itemCode = url?.split("/")[3]?.split("-")[lastIndex];
    // console.log(itemCode);
    if (!itemCode) {
      return res.status(400).json({ isOk: false, message: 'Invalid url' });
    }

    // credentials for download request
    const mainURL = `https://elements.envato.com/elements-api/items/${itemCode}/download_and_license.json`;
    const payload =  getPayload();
    const headers =  getHeaders(url);


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