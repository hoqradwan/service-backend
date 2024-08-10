import mongoose from 'mongoose';

const CookieSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      enum: ['envato'],
    },
    account: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      
    },
    cookie: {
      type: String,
      required: true,
    },
    csrfToken: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active'
    },
  },
  { timestamps: true },
);

export const Cookie =
  mongoose.models.Cookie || mongoose.model('Cookie', CookieSchema);
