import mongoose, { Schema } from 'mongoose';

const SupportSchema = new Schema(
  {
    name: { type: String, required: true },
    goToURL: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const Support =
  mongoose.models.Support || mongoose.model('support', SupportSchema);
