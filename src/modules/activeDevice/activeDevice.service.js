import mongoose from 'mongoose';
import { ActiveDeviceModel } from './activeDevice.model.js';

// delete the expired token devices
export const cleanExpiredDevicesService = async () => {
  try {
    const now = new Date();
    await ActiveDeviceModel.deleteMany({
      expiresAt: { $lt: now },
    });
  } catch (error) {
    console.error('Error during expired device cleanup:', error);
  }
};

// log out from all active devices service
export const logoutAllDevicesService = async (userId) => {
  return await ActiveDeviceModel.deleteMany({ userId });
};

// current active devices by user id service
export const activeDevicesByIdService = async (userId) => {
  return await ActiveDeviceModel.find({ userId: userId });
};

// add new login device service
export const addDeviceService = async (userId, deviceId, token, deviceInfo) => {
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  // Save device info
  const device = new ActiveDeviceModel({
    userId,
    deviceId,
    token,
    deviceInfo,
    issuedAt,
    expiresAt,
  });

  return await device.save();
};

// log out from device
export const logOutFromCurrentDeviceService = async (userId, deviceId) => {
  return await ActiveDeviceModel.deleteOne({
    userId: new mongoose.Types.ObjectId(userId),
    deviceId: deviceId,
  });
};
