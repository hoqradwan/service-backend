import mongoose from 'mongoose';
import { UserModel } from './user.model.js';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import httpStatus from 'http-status';
export const findUserByEmail = async (email) => {
  
  return UserModel.findOne({ email });
};

export const createUser = async ({ name, email, hashedPassword, phone, adminPassword, image, role, currentLicense, serial }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newUser = { name, email, password: hashedPassword, phone, role, adminPassword, image, currentLicense, serial };
    const createdUser = await UserModel.create([newUser], { session });

    await session.commitTransaction();
    return { createdUser: createdUser[0] };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const findUserById = async (id) => {

  return UserModel.findById(id);
};

export const updateUserById = async (id, updateData) => {
  return UserModel.findByIdAndUpdate(id, updateData, { new: true });
};



export const deleteUserById = async (id) => {
  return UserModel.findByIdAndDelete(id);
};


export const getUserStatisticsService = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const result = await UserModel.aggregate([
    {
      $facet: {
        totalUsers: [
          { $count: 'count' }, // Count all users
        ],
        totalActiveUsers: [
          { $match: { isActive: true } }, 
          { $count: 'count' }, // Count active users
        ],
        todayJoinedUsers: [
          {
            $match: {
              createdAt: { $gte: startOfDay, $lte: endOfDay }
            }
          }, 
          { $count: 'count' }, // Count today's joined users
        ],
      },
    },
    {
      $project: {
        totalUsers: { $arrayElemAt: ['$totalUsers.count', 0] }, 
        totalActiveUsers: { $arrayElemAt: ['$totalActiveUsers.count', 0] }, 
        todayJoinedUsers: { $arrayElemAt: ['$todayJoinedUsers.count', 0] },
      },
    },
  ]);

  return {
    totalUsers: result[0]?.totalUsers || 0,
    totalActiveUsers: result[0]?.totalActiveUsers || 0,
    todayJoinedUsers: result[0]?.todayJoinedUsers || 0,
  };
};