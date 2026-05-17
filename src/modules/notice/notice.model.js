import mongoose, { Schema } from 'mongoose';

const NoticeSchema = new Schema(
  {
    active: {
      type: Boolean,
      default: false,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    service: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Notice =
  mongoose.models.Notice || mongoose.model('notice', NoticeSchema);
