import mongoose, { Schema } from 'mongoose';

const BannerSchema = new Schema(
  {
    fileName: { type: String, required: true },
    goToURL: { type: String, required: true},
    side: {
      type: String,
      enum: ['left', 'right'],
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Banner =
  mongoose.models.Banner || mongoose.model('banner', BannerSchema);
