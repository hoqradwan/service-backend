import dotenv from 'dotenv';
import connectDB from './config/db.js';
import express from 'express';
import cors from 'cors';
import router from './src/routes/index.js';
import cron from 'node-cron';

import { updateLicenseStatus } from './src/modules/license/license.utils.js';
import globalErrorHandler from './src/middleware/globalErrorHandler.js';
import notFoundRoute from './src/middleware/notFoundRoute.js';
import { cleanExpiredDevicesService } from './src/modules/activeDevice/activeDevice.service.js';
import { checkRecentlyInactiveCookies } from './src/modules/cookie/cookie.utils.js';
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

cron.schedule('0 0 * * *', () => {
  console.log('Running daily license status update...');
  updateLicenseStatus().catch((err) =>
    console.error('Error updating license status:', err),
  );
});

// Delete active devices if the token is expired(checking in every minute)
cron.schedule('* * * * *', async () => {
  // console.log('Cron job triggered');
  try {
    await cleanExpiredDevicesService();
  } catch (err) {
    console.error('Error cleaning expired active devices:', err);
  }
});

// Check and reactivate valid cookies every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  try {
    await checkRecentlyInactiveCookies();
  } catch (error) {
    console.error('Error in cookie reactivation cron job:', error);
  }
});

app.use('*', notFoundRoute);
app.use(globalErrorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
