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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
