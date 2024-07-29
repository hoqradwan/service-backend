
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const router = require('./src/routes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Routes
 app.use(router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
