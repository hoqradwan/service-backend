import bcrypt from 'bcrypt';
import { UserModel } from './user.model.js';

import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import catchAsync from '../../utils/catchAsync.js';
import sendError from '../../utils/sendError.js';
import sendResponse from '../../utils/sendResponse.js';
import {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
  getUserStatisticsService,
  // logoutUser,
  updateUserById,
} from './user.service.js';
import {
  generateSessionId,
  generateToken,
  hashPassword,
} from './user.utils.js';
import { validateUserInput } from './user.validation.js';

export const registerUser = catchAsync(async (req, res) => {
  const { name, email, password, phone, image } = req.body;

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
  });

  const token = generateToken({ name, email });

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  if (createdUser) {
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'You are ready to move in the site',
      data: null,
    });
  }
});

export const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await findUserByEmail(email);

  if (!user) {
    return sendError(res, httpStatus.NOT_FOUND, {
      message: 'This account does not exist.',
    });
  }

  // Validate the password or admin password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  const isAdminPasswordValid = password === user.adminPassword;

  if (!isPasswordValid && !isAdminPasswordValid) {
    return sendError(res, httpStatus.UNAUTHORIZED, {
      message: 'Invalid password.',
    });
  }

  // Get IP address from request
  const userIp = req.headers['x-forwarded-for'] || req.ip;
  // Check if the IP address is already registered
  if (!user.loggedInIps.includes(userIp)) {
    // Check the device limit (assuming user.deviceLimit is the custom limit)
    if (user.loggedInIps.length >= user.deviceLimit) {
      return sendError(res, httpStatus.FORBIDDEN, {
        message: `Device limit of ${user.deviceLimit} reached. Please log out from another device.`,
      });
    }

    // Add the new IP to loggedInIps
    user.loggedInIps.push(userIp);
    await user.save();
  }

  // Generate the token
  const token = generateToken({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  // Set cookie with the token
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  // Send successful response
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
      },
      token,
    },
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

  // Update the serial numbers of users with a higher serial
  const usersWithHigherSerial = await UserModel.find({
    serial: { $gt: user.serial },
  });
  for (const userWithHigherSerial of usersWithHigherSerial) {
    await updateUserById(userWithHigherSerial._id, {
      serial: userWithHigherSerial.serial - 1,
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

export const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, phone, image, isActive, currentLicense } =
    req.body;

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

  // Update the serial number if the user's serial is not the same as the last user's serial
  const lastUser = await UserModel.findOne({}, {}, { sort: { createdAt: -1 } });
  if (lastUser && user.serial !== lastUser.serial) {
    updateData.serial = lastUser.serial + 1;
  }

  const updatedUser = await updateUserById(userId, updateData);
  if (updatedUser) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User updated successfully',
      data: null,
    });
  }
});

export const getUserInfo = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    return sendError(res, httpStatus.FORBIDDEN, {
      message: 'Only admin can access all user list.',
    });
  }

  const page = parseInt(req?.query?.page) || 1;
  const limit = parseInt(req?.query?.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await UserModel.aggregate([
    {
      $match: {
        _id: { $ne: req.user.id },
        role: { $ne: 'admin' },
      },
    },
    {
      $setWindowFields: {
        sortBy: { createdAt: -1 }, // Sort by createdAt or any other field you prefer
        output: {
          serial: {
            $documentNumber: {}, // Generates a sequential number for each document
          },
        },
      },
    },
    {
      $lookup: {
        from: 'licenses',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$user', '$$userId'],
              },
            },
          },
          {
            $count: 'totalLicenses',
          },
        ],
        as: 'licenses',
      },
    },
    {
      $addFields: {
        totalLicenses: {
          $ifNull: [{ $arrayElemAt: ['$licenses.totalLicenses', 0] }, 0],
        },
      },
    },
    {
      $project: {
        password: 0,
        adminPassword: 0,
        licenses: 0,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  const totalUsers = await UserModel.countDocuments({
    _id: { $ne: req.user.id },
    role: { $ne: 'admin' },
  });

  const admins = await UserModel.find(
    { role: 'admin' },
    '-password -adminPassword',
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
    '-password -adminPassword',
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

  const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h',
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.Nodemailer_GMAIL,
      pass: process.env.Nodemailer_GMAIL_PASSWORD,
    },
  });
  const resetLink = `${process.env.url}/reset-password/${token}`; //frontend url
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
    from: 'digitaltoolsbd@gmail.com',
    to: email,
    subject: 'Reset Password.',
    html: emailContent,
  };

  await transporter.sendMail(receiver);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset link sent to your email. Please check!',
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
    message: 'Password reset successfully',
    data: null,
  });
});

export const getUserStatistics = catchAsync(async (req, res) => {
  const result = await getUserStatisticsService();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Retrieved user stats successfully',
    data: result,
  });
});
