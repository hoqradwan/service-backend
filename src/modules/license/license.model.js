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
      default: '',
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
      enum: ['new', 'used', 'expired'],
      default: 'new',
    },
    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true },
);
// save and generate a unique license key
licenseSchema.pre('save', function (next) {
  if (this.isNew) {
    this.licenseKey = generateLicenseKey();
    this.expiryDate = new Date(this.createdAt);
    this.expiryDate.setDate(this.expiryDate.getDate() + this.dayLimit);
  }
  next();
});

export const LicenseModel =
  mongoose.models.License || mongoose.model('License', licenseSchema);
