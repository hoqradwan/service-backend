import dotenv from 'dotenv';
import connectDB from './config/db.js';
import express from 'express';
import cors from 'cors';
import router from './src/routes/index.js';
import cron from 'node-cron';

import { updateLicenseStatus } from './src/modules/license/license.utils.js';
dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Routes
app.use(router);

// Add a route handler for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// cron.schedule('0 0 * * *', () => {
//   console.log('Running daily license status update...');
//   updateLicenseStatus().catch((err) =>
//     console.error('Error updating license status:', err),
//   );
// });
cron.schedule('* * * * *', () => {
  console.log('Running license status update...');
  updateLicenseStatus().catch((err) => {
    console.error('Error updating license status:', err);
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.get('/download', async (req, res) => {
//   const fileUrl = 'https://elements.envato.com/logo-creation-kit-LTWP6X';
//   // const downloadPath = path.resolve(__dirname, 'downloads', 'premium-item.zip');

//   try {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(fileUrl);

//     await page.waitForSelector('#username', {
//       timeout: 1000,
//     });
//     await page.type('#username', 'bddigitaltools@gmail.com');
//     await page.waitForSelector('input[data-testid="password"]', {
//       timeout: 1000,
//     });
//     await page.type('input[data-testid="password"]', '3$00D.#@#%67030p7bpIl96');
//     await page.waitForSelector('a[data-testid="pageheader-user-auth-link"]', {
//       timeout: 1000,
//     });
//     await page.waitForSelector('button[data-testid="submitButton"]', {
//       timeout: 1000,
//     });
//     await page.click('button[data-testid="submitButton"]');
//     await page.click('a[data-testid="pageheader-user-auth-link"]');
//     await page.waitForSelector(
//       'button[data-testid="action-bar-download-button"]',
//       { timeout: 1000 },
//     );

//     await page.click('[data-testid="action-bar-download-button"]');
//     await page.waitForSelector(
//       'input[data-testid="existing-project-name-input"][value="04digitaltoolsbd"]',
//       { timeout: 5000 },
//     );
//     await page.click(
//       'input[data-testid="existing-project-name-input"][value="04digitaltoolsbd"]',
//     );
//     // await page.waitForNavigation();

//     // Navigate to the premium item

//     // // Download the item
//     // const [download] = await Promise.all([
//     //   page.waitForEvent('download'),
//     //   page.click('a.download-button-selector'), // Replace with the actual selector
//     // ]);

//     // // Save the download
//     // await download.saveAs(downloadPath);

//     await browser.close();

//     // Serve the downloaded file to the user
//     // res.download(downloadPath);
//     res.send({ message: 'success' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred while downloading the file.');
//   }
// });
