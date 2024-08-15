import mongoose, { Schema } from 'mongoose';
import { generateLicenseKey } from './license.utils.js';

const licenseSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      enum: ['Envato'],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    dayLimit: {
      type: Number,
      required: true,
    },
    dailyLimit: {
      type: Number,
      required: true,
    },
    totalLimit: {
      type: Number,
      required: true,
    },
    licenseKey: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ['new', 'used', 'expired','suspended'],
      default: 'new',
    },
    activationDate: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    localTime: {
      type: Date,
      default: new Date()?.toLocaleString()
    },
    
  },
  { timestamps: true },
);
// Pre-save hook to generate a unique license key
licenseSchema.pre('save', function (next) {
  if (this.isNew) {
    this.licenseKey = generateLicenseKey();
  }
  next();
});

export const LicenseModel =
  mongoose.models.License || mongoose.model('License', licenseSchema);
