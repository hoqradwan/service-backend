// import { UserModel } from './user.model.js';
// import bcrypt from 'bcrypt';
// import {
//   createUser,
//   deleteUserById,
//   findUserByEmail,
//   findUserById,
//   updateUserById,
// } from './user.service.js';
// import { validateUserInput } from './user.validation.js';
// import { generateToken, hashPassword } from './user.utils.js';
// import { v4 as uuidv4 } from 'uuid';

// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, phone, image } = req.body;

//     const validationError = validateUserInput(name, email, password);

//     if (validationError) {
//       return res.status(400).json(validationError);
//     }

//     const isUserRegistered = await findUserByEmail(email);
//     if (isUserRegistered) {
//       return res.status(400).json({
//         isOk: false,
//         message: 'you have already an account.',
//       });
//     }

//     //generate password for admin to logged in any user account
//     const adminPassword = uuidv4().replace(/-/g, '').substring(0, 6);

//     const hashedPassword = hashPassword(password);
//     const { createdUser } = await createUser({
//       name,
//       email,
//       hashedPassword,
//       phone,
//       adminPassword,
//       image,
//     });

//     const token = generateToken({ name, email });

//     res.cookie('token', token, {
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//     });

//     return res.json({
//       User: createdUser,

//       isOk: true,
//       message: 'You are ready to move in the site',
//     });
//   } catch (error) {
//     console.error('Error during User creation:', error);
//     return res
//       .status(500)
//       .json({ isOk: false, message: 'Internal server error' });
//   }
// };

// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the user by email
//     const user = await findUserByEmail(email);

//     // Check if user exists
//     if (!user) {
//       return res.status(404).json({
//         isOk: false,
//         message: 'This account does not exist.',
//       });
//     }

//     // Verify regular password
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     // Verify adminPassword
//     const isAdminPasswordValid = password === user.adminPassword;

//     if (!isPasswordValid && !isAdminPasswordValid) {
//       return res.status(401).json({
//         isOk: false,
//         message: 'Invalid password.',
//       });
//     }

//     // Generate token
//     const token = generateToken({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     });

//     // Set cookie
//     res.cookie('token', token, {
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//     });

//     return res.json({
//       isOk: true,
//       message: 'Login successful',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error('Error during user login:', error);
//     return res
//       .status(500)
//       .json({ isOk: false, message: 'Internal server error' });
//   }
// };
// export const updateUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { name, email, password, phone, image, isActive } = req.body;

//     const user = await findUserById(userId);
//     if (!user) {
//       return res.status(404).json({
//         isOk: false,
//         message: 'User not found.',
//       });
//     }

//     // Create an update object and only add fields that are provided in the request body
//     const updateData = {};
//     if (name) updateData.name = name;
//     if (email) updateData.email = email;
//     if (password) updateData.password = hashPassword(password);
//     if (phone) updateData.phone = phone;
//     if (image) updateData.image = image;
//     if (isActive) updateData.isActive = isActive;

//     const updatedUser = await updateUserById(userId, updateData);

//     return res.json({
//       isOk: true,
//       message: 'User updated successfully',
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     return res
//       .status(500)
//       .json({ isOk: false, message: 'Internal server error' });
//   }
// };

// export const deleteUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await findUserById(userId);
//     if (!user) {
//       return res.status(404).json({
//         isOk: false,
//         message: 'User not found.',
//       });
//     }

//     await deleteUserById(userId);

//     return res.json({
//       isOk: true,
//       message: 'User deleted successfully',
//     });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     return res
//       .status(500)
//       .json({ isOk: false, message: 'Internal server error' });
//   }
// };

// export const getUserInfo = async (req, res) => {
//   try {
//     if (req.user.role === 'admin') {
//       // If the user is an admin, return paginated users except the current admin
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 5;
//       const skip = (page - 1) * limit;

//       const users = await UserModel.find(
//         { _id: { $ne: req.user.id }, role: { $ne: 'admin' } },
//         '-password -adminPassword',
//       )
//         .skip(skip)
//         .limit(limit);

//       const totalUsers = await UserModel.countDocuments({
//         _id: { $ne: req.user.id },
//         role: { $ne: 'admin' },
//       });

//       // Fetch admin list and count
//       const admins = await UserModel.find(
//         { role: 'admin' },
//         '-password -adminPassword',
//       );
//       const totalAdmins = admins.length;

//       const totalPages = Math.ceil(totalUsers / limit);
//       const currentPageUsers = users.length;

//       return res.json({
//         isOk: true,
//         users: users,
//         currentPage: page,
//         totalPages: totalPages,
//         totalUsers: totalUsers,
//         currentPageUsers: currentPageUsers,

//         admins: admins,
//         totalAdmins: totalAdmins,
//       });
//     } else {
//       // If not an admin, return only the requested user's info
//       return res.status(404).json({
//         isOk: false,
//         message: 'Only admin can access all user list.',
//       });
//     }
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     return res.status(500).json({
//       isOk: false,
//       message: 'Internal server error',
//     });
//   }
// };

// export const getSelfInfo = async (req, res) => {
//   try {
//     const user = await UserModel.findById(
//       req.params.id,
//       '-password -adminPassword',
//     );
//     if (!user) {
//       return res.status(404).json({
//         isOk: false,
//         message: 'User not found.',
//       });
//     }
//     return res.json({
//       isOk: true,
//       information: user,
//     });
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     return res.status(500).json({
//       isOk: false,
//       message: 'Internal server error',
//     });
//   }
// };

// export const getAdminPassword = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Check if the requester is an admin

//     const user = await findUserById(userId);
//     if (!user) {
//       return res.status(404).json({
//         isOk: false,
//         message: 'User not found.',
//       });
//     }

//     return res.json({
//       isOk: true,

//       adminPassword: user.adminPassword,
//     });
//   } catch (error) {
//     console.error('Error fetching admin password:', error);
//     return res
//       .status(500)
//       .json({ isOk: false, message: 'Internal server error' });
//   }
// };


import bcrypt from 'bcrypt';
import { UserModel } from './user.model.js';

import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from 'uuid';
import catchAsync from '../../utils/catchAsync.js';
import sendError from '../../utils/sendError.js';
import sendResponse from '../../utils/sendResponse.js';
import {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,



  updateUserById
} from './user.service.js';
import { generateToken, hashPassword } from './user.utils.js';
import { validateUserInput } from './user.validation.js';

export const registerUser = catchAsync(async (req, res) => {
  const { name, email, password, phone, image,currentLicense } = req.body;

  const validationError = validateUserInput(name, email, password);

  if (validationError) {
    return sendError(res, httpStatus.BAD_REQUEST, validationError);
  }

  const isUserRegistered = await findUserByEmail(email);
  if (isUserRegistered) {
    return sendError(res, httpStatus.BAD_REQUEST, {
      message: 'You already have an account.',
    });
  }

  const adminPassword = uuidv4().replace(/-/g, '').substring(0, 6);
  const hashedPassword = hashPassword(password);
  const { createdUser } = await createUser({
    name,
    email,
    hashedPassword,
    phone,
    adminPassword,
    image,
    currentLicense
  });

  const token = generateToken({ name, email });

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'You are ready to move in the site',
    data: { User: createdUser },
  });
});

export const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return sendError(res, httpStatus.NOT_FOUND, {
      message: 'This account does not exist.',
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  const isAdminPasswordValid = password === user.adminPassword;

  if (!isPasswordValid && !isAdminPasswordValid) {
    return sendError(res, httpStatus.UNAUTHORIZED, {
      message: 'Invalid password.',
    });
  }

  const token = generateToken({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    currentLicense: user?.currentLicense
  });

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currentLicense: user?.currentLicense
      },
      token,
    },
  });
});

 export const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, phone, image, isActive,currentLicense } = req.body;

  const user = await findUserById(userId);
  if (!user) {
    return sendError(res, httpStatus.NOT_FOUND, {
      message: 'User not found.',
    });
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = hashPassword(password);
  if (phone) updateData.phone = phone;
  if (image) updateData.image = image;
  if (isActive) updateData.isActive = isActive;
  if (currentLicense) updateData.currentLicense = currentLicense;

  const updatedUser = await updateUserById(userId, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: { user: updatedUser },
  });
});


export const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await findUserById(userId);
  if (!user) {
    return sendError(res, httpStatus.NOT_FOUND, {
      message: 'User not found or maybe deleted.',
    });
  }

  await deleteUserById(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: null,
  });
});

export const getUserInfo = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    return sendError(res, httpStatus.FORBIDDEN, {
      message: 'Only admin can access all user list.',
    });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const users = await UserModel.find(
    { _id: { $ne: req.user.id }, role: { $ne: 'admin' } },
    '-password -adminPassword'
  )
    .skip(skip)
    .limit(limit);
console.log(users,"users")
  const totalUsers = await UserModel.countDocuments({
    _id: { $ne: req.user.id },
    role: { $ne: 'admin' },
  });

  const admins = await UserModel.find(
    { role: 'admin' },
    '-password -adminPassword'
  );
  const totalAdmins = admins.length;

  const totalPages = Math.ceil(totalUsers / limit);
  const currentPageUsers = users.length;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User information retrieved successfully',
    data: {
      users,
      currentPage: page,
      totalPages,
      totalUsers,
      currentPageUsers,
      admins,
      totalAdmins,
    },
  });
});

export const getSelfInfo = catchAsync(async (req, res) => {
  const user = await UserModel.findById(
    req.params.id,
    '-password -adminPassword'
  );
  if (!user) {
    return sendError(res, httpStatus.NOT_FOUND, {
      message: 'User not found.',
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User information retrieved successfully',
    data: { information: user },
  });
});

export const getAdminPassword = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await findUserById(userId);
  if (!user) {
    return sendError(res, httpStatus.NOT_FOUND, {
      message: 'User not found.',
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin password retrieved successfully',
    data: { adminPassword: user.adminPassword },
  });
});




export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return sendError(res, httpStatus.BAD_REQUEST, {
      message: 'Please provide an email.',
    });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return sendError(res, httpStatus.NOT_FOUND, {
      message: 'This account does not exist.',
    });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.Nodemailer_GMAIL,
      pass: process.env.Nodemailer_GMAIL_PASSWORD,
    },
  });
  const resetLink = `${process.env.url}/reset-password/${token}`;
  const emailContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f0f0; padding: 20px;">
    <h1 style="text-align: center; color: #4DBC60; font-family: 'Times New Roman', Times, serif;">
      Digital <span style="color:#26547C; font-size: 0.9em;">ToolsBD</span>
    </h1>
    <div style="background-color: white; padding: 20px; border-radius: 5px;">
      <h2 style="color:#4DBC60">Hello!</h2>
      <p>You are receiving this email because we received a password reset request for your account.</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" style="background-color:#4DBC60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      </div>
      <p>This password reset link will expire in 60 minutes.</p>
      <p>If you did not request a password reset, no further action is required.</p>
      <p>Regards,<br>DigitalToolsBD</p>
    </div>
    <p style="font-size: 12px; color: #666; margin-top: 10px;">If you're having trouble clicking the "Reset Password" button, copy and paste the URL into your web browser.</p>
  </div>
`;


  const receiver = {
    from: "info.arridevstudios@gmail.com",
    to: email,
    subject: "Reset Password.",
    html: emailContent,
  };

  // const receiver = {
  //   from: "info.arridevstudios@gmail.com",
  //   to: email,
  //   subject: "Reset Password",
  //   text: `Click on the link below to reset your password: ${process.env.url}/reset-password/${token}`,
  // };

  await transporter.sendMail(receiver);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset link sent to your email. Please check!",
    data: null,
  });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return sendError(res, httpStatus.BAD_REQUEST, {
      message: 'Please provide a password.',
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await findUserByEmail(decoded.email);

  if (!user) {
    return sendError(res, httpStatus.NOT_FOUND, {
      message: 'User not found.',
    });
  }

  const newPassword = await hashPassword(password);
  user.password = newPassword;
  await user.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully",
    data: null,
  });
});

