import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './app/config/db.js';
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// Routes
// app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});
app.get('/download', async (req, res) => {
  const fileUrl = 'https://elements.envato.com/logo-creation-kit-LTWP6X';
  const downloadPath = path.resolve(__dirname, 'downloads', 'premium-item.zip');

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Log in to Envato
    // await page.goto('https://account.envato.com/sign_in');
    // await page.goto('https://elements.envato.com/logo-creation-kit-LTWP6X');
    // await page.type('#sign_in_form_username', 'your-envato-username');
    // await page.type('#sign_in_form_password', 'your-envato-password');
    await page.click('[data-testid="action-bar-download-button"]');
    await page.waitForSelector(
      'input[data-testid="existing-project-name-input"][value="04digitaltoolsbd"]',
      { timeout: 5000 },
    );
    await page.click(
      'input[data-testid="existing-project-name-input"][value="04digitaltoolsbd"]',
    );
    await page.waitForNavigation();

    // Navigate to the premium item
    await page.goto(fileUrl);

    // Download the item
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('a.download-button-selector'), // Replace with the actual selector
    ]);

    // Save the download
    await download.saveAs(downloadPath);
    await browser.close();

    // Serve the downloaded file to the user
    res.download(downloadPath);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while downloading the file.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
