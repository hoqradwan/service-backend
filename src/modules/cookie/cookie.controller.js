// import { downloadFromEnvato } from './cookie.service.js';

// export const downloadContent = async (req, res) => {
//   try {
//     const { url } = req.body;
//     if (!url) {
//       return res.status(400).json({ isOk: false, message: 'URL is required' });
//     }

//       const content = await downloadFromEnvato(url);
//       //console.log(content,"content")
//     if (!content) {
//       return res.status(500).json({ isOk: false, message: 'Failed to download content' });
//     }

//     res.setHeader('Content-Disposition', `attachment; filename="${content.filename}"`);
//     res.setHeader('Content-Type', content.mimeType);
//     res.send(content.data);
//   } catch (error) {
//     console.error('Error downloading content:', error);
//     return res.status(500).json({ isOk: false, message: 'Internal server error' });
//   }
// };
import { downloadContent } from './cookie.service.js';
import { getCookie } from './cookie.utils.js';

export const handleDownload = async (req, res) => {
  try {
    const { URL } = req.body;
    console.log("hitting");
    const url = 'https://elements.envato.com/elements-api/items/PJ2ER57/download_and_license.json';
    const payload = {
      licenseType: "project",
      projectName: "04digitaltoolsbd",
      searchCorrelationId: "61964461-3f5c-4eeb-85f7-2548bd03a97c"
    };

    const cookie = getCookie();
    // console.log(cookie,"cookie")
    if (!url) {
      return res.status(400).json({ isOk: false, message: 'URL is required' });
    }

    if (!cookie) {
      return res.status(400).json({ isOk: false, message: 'Cookie is required' });
    }

    const { filePath, message } = await downloadContent(url, cookie, payload);

    res.json({
      isOk: true,
      message,
      filePath
    });
  } catch (error) {
    console.error('Error handling download:', error);
    res.status(500).json({ isOk: false, message: 'Internal server error' });
  }
};
