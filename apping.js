// // import cors from 'cors';
// // import express from 'express';
// // import { StudentRoutes } from './app/modules/student/student.route';

// // const app = express();

// // //parsers
// // app.use(express.json());
// // const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const userRoutes = require('./routes/userRoutes');

// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Routes
// app.use('/api', userRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// // // application routes
// // app.use('/api/v1/students', StudentRoutes);

// // const getAController = (req, res) => {
// //   const a = 10;
// //   res.send(a);
// // };

// // app.get('/', getAController);
// // app.listen(port, () => {
// //   console.log(`App is running on port ${port}`.yellow.bold);
// // });
// // export default app;
