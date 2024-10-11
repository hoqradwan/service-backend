import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    adminPassword: { type: String, length: 6 },
    phone: { type: String },
    image: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isActive: { type: Boolean, default: false },
    currentLicense: {
      type: Schema.Types.ObjectId,
      ref: 'License',
      default: null,
    },
    currentStoryBlocksLicense: {
      type: Schema.Types.ObjectId,
      ref: 'License',
      default: null,
    },
    currentMotionArrayLicense: {
      type: Schema.Types.ObjectId,
      ref: 'License',
      default: null,
    },
    currentFreepikLicense: {
      type: Schema.Types.ObjectId,
      ref: 'License',
      default: null,
    },
    // loggedInIps: { type: [String], default: [] }, // Store allowed IP addresses
    // deviceLimit: { type: Number, default: 1 }, // Custom device limit for each user
  },
  { timestamps: true },
);

export const UserModel =
  mongoose.models.User || mongoose.model('User', UserSchema);
// import mongoose, { Schema } from 'mongoose';

// const UserSchema = new Schema(
//   {
//     name: { type: String },
//     email: { type: String, required: true, unique: true },
//     password: { type: String },
//     adminPassword: { type: String, minlength: 6 }, // Fixed length validation
//     phone: { type: String },
//     image: { type: String },
//     role: { type: String, enum: ['admin', 'user'], default: 'user' },
//     isActive: { type: Boolean, default: false },
//     currentLicense: {
//       type: Schema.Types.ObjectId,
//       ref: 'License',
//       default: null,
//     },
//     // tokens: [
//     //   {
//     //     token: {
//     //       type: String,
//     //     },
//     //   },
//     // ],
//     currentStoryBlocksLicense: {
//       type: Schema.Types.ObjectId,
//       ref: 'License',
//       default: null,
//     },
//     currentMotionArrayLicense: {
//       type: Schema.Types.ObjectId,
//       ref: 'License',
//       default: null,
//     },
//     currentFreepikLicense: {
//       type: Schema.Types.ObjectId,
//       ref: 'License',
//       default: null,
//     },
//     // deviceLimit: { type: Number, default: 1 }, // Custom device limit for each user
//   },
//   { timestamps: true },
// );

// export const UserModel =
//   mongoose.models.User || mongoose.model('User', UserSchema);
