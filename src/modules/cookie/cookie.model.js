import mongoose from 'mongoose';

const CookieSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      enum: ['envato', 'story-blocks', 'motion-array', 'freepik'],
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
    cookie: {   // Vid(story-blocks) || laravel_session(motion-array) || GR_REFRESH(Freepik)
      type: String,
      required: true,
    },
    csrfToken: {   // csrf token(envato) || login session token(story-blocks) || GR_TOKEN(Freepik)
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
