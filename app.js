import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import globalErrorHandler from './src/middleware/globalErrorHandler.js';
import notFoundRoute from './src/middleware/notFoundRoute.js';
import router from './src/routes/index.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());


// All Routes
app.use(router);

// Add a route handler for the root path
app.get('/', (req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to our server',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




app.use('*', notFoundRoute);
app.use(globalErrorHandler);
