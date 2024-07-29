import mongoose from 'mongoose';
import { UserModel } from './user.model.js';

export const findUserByEmail = async (email) => {
  return UserModel.findOne({ email });
};

export const createUser = async ({ name, email, hashedPassword }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newUser = { name, email, password: hashedPassword };
    const createdUser = await UserModel.create([newUser], { session });

    await session.commitTransaction();
    return createdUser[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};