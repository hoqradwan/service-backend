const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// // import dotenv from 'dotenv';
// // import path from 'path';

// // dotenv.config({ path: path.join((process.cwd(), '.env')) });

// // export default {
// //   port: process.env.PORT,
// //   database_url: process.env.DATABASE_URL,
// // };
// const mongoose = require('mongoose');
// const dotenv = require('dotenv').config();
// const colors = require('colors');
// const DBConnect = require('./utils/dbConnect');

// const app = require('../../app');

// // database connection
// DBConnect();

// // server
// const port = process.env.PORT || 8080;

// app.listen(port, () => {
//   console.log(`App is running on port ${port}`.yellow.bold);
// });

// import mongoose from 'mongoose';
// const dotenv = require('dotenv');
// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.join((process.cwd(), '.env')) });

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DATABASE_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected...');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
