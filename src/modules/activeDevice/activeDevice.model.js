import mongoose, { Schema } from 'mongoose';

const ActiveDeviceSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    }, // unique id for every device
    token: {
      type: String,
      required: true,
    }, // JWT token for the session
    issuedAt: {
      type: Date,
      required: true,
    }, // When the token was issued
    expiresAt: {
      type: Date,
      required: true,
    }, // Token expiration time
    deviceInfo: {
      type: {
        deviceName: { type: String },
        ipAddress: { type: String },
        userAgent: { type: String },
        os: { type: String },
      },
      default: {},
    },
  },
  { timestamps: true },
);

export const ActiveDeviceModel =
  mongoose.models.Device || mongoose.model('ActiveDevice', ActiveDeviceSchema);
