
// import { downloadContent } from './cookie.service.js';
// import { getCookie } from './cookie.utils.js';

// export const handleDownload = async (req, res) => {
//   try {
//       const { url } = req.body;
      
//     const cookie = getCookie();
// // console.log(cookie,"cookie")
//     if (!url) {
//       return res.status(400).json({ isOk: false, message: 'URL is required' });
//     }

//     if (!cookie) {
//       return res.status(400).json({ isOk: false, message: 'Cookie is required' });
//     }

//     const { filePath, message } = await downloadContent(url, cookie);

//     res.json({
//       isOk: true,
//       message,
//       filePath
//     });
//   } catch (error) {
//     console.error('Error handling download:', error);
//     res.status(500).json({ isOk: false, message: 'Internal server error' });
//   }
// };

import { downloadContent } from './cookie.service.js';
import { getCookie, getCsrfToken } from './cookie.utils.js';

export const handleDownload = async (req, res) => {
    try {
      const { url } = req.body;
      const cookie = getCookie();
     // console.log(cookie,"cookie")
      const csrfToken = getCsrfToken();
  
      if (!url || !cookie || !csrfToken) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
  
      const result = await downloadContent(url, cookie, csrfToken);
      
      res.json({
        message: result.message,
        filePath: result.filePath
      });
    } catch (error) {
      console.error('Error in handleDownload:', error);
      res.status(500).json({ error: 'Failed to download content' });
    }
  };