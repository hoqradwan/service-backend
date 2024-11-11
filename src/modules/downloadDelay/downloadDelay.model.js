import mongoose, { Schema } from 'mongoose';

const DownloadRestrictSchema = new Schema(
  {
    service: {
      type: String,
      required: true,
      enum: ['Envato Elements', 'Story Blocks', 'Motion Array', 'Freepik'],
    },
    delay: {
      type: Number,
      required: true,
      min: 0,
    },
    isRestricted: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const DownloadRestrict =
  mongoose.models.DownloadRestrict ||
  mongoose.model('DownloadRestrict', DownloadRestrictSchema);
