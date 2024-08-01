import mongoose, { Schema } from 'mongoose';

const DownloadSchema = new Schema(
  {
    service: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted'], required: true },
    downloadedAt: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const Download =
  mongoose.models.Download || mongoose.model('download', DownloadSchema);
