import mongoose, { Schema } from 'mongoose';

const DownloadSchema = new Schema(
  {
    service: { type: String, required: true },
    content: { type: String, required: true }, // envato content url link
    contentLicense: { type: String, required: true }, // envato content download license url
    serviceId: { type: String, required: true }, // cookie account Id
    licenseId: { type: String, required: true }, // License Id
    status: { type: String, enum: ['pending', 'accepted'], required: true },
    downloadedAt: { type: String, required: true },
    downloadedBy: { type: String, required: true },
    serial: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

export const Download =
  mongoose.models.Download || mongoose.model('download', DownloadSchema);
