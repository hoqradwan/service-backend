import mongoose, { Schema } from 'mongoose';

const DownloadSchema = new Schema(
  {
    service: { type: String, required: true },
    content: { type: String, required: true }, // envato content url link
    contentLicense: { type: String, required: true }, // envato content download license url
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Cookie',
      required: true
    }, // cookie account Id
    licenseId: {
      type: Schema.Types.ObjectId,
      ref: 'License',
      default: null
    }, // License Id
    status: { type: String, enum: ['pending', 'accepted'], required: true },
    downloadedAt: { type: String, required: true },
    downloadedBy: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const Download =
  mongoose.models.Download || mongoose.model('download', DownloadSchema);
