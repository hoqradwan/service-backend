import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import {
  deleteUser,
  forgotPassword,
  getAdminPassword,
  getSelfInfo,
  getUserInfo,
  getUserStatistics,
  loginUser,
  // logout,
  registerUser,
  resetPassword,
  updateUser,
} from './user.controller.js';
import {
  loginValidationSchema,
  registerUserValidationSchema,
  updateUserValidationSchema,
} from './user.validation.js';

const router = express.Router();

router.post(
  '/register',
  validateRequest(registerUserValidationSchema),
  registerUser,
);
router.post('/login', validateRequest(loginValidationSchema), loginUser);
router.post('/forget-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
// router.post('/logout', adminMiddleware('user', 'admin'), logout);

router.put(
  '/update/:userId',
  //adminMiddleware('user'),.
  validateRequest(updateUserValidationSchema),
  updateUser,
);

router.delete('/delete/:userId', adminMiddleware('admin'), deleteUser);
router.get(
  '/admin-password/:userId',
  adminMiddleware('admin'),
  getAdminPassword,
); // Admin can login generating new password in any user account
router.get('/user-list', adminMiddleware('admin'), getUserInfo);

router.get('/information/:id', getSelfInfo);
router.get('/user-stats', adminMiddleware('admin'), getUserStatistics);

export default router;
// import express from 'express';
// import { adminMiddleware } from '../../middleware/auth.js';
// import validateRequest from '../../middleware/validateRequest.js';
// import {
//   deleteUser,
//   forgotPassword,
//   getAdminPassword,
//   getSelfInfo,
//   getUserInfo,
//   getUserStatistics,
//   loginUser,
//   // logoutUser,
//   // logout,
//   registerUser,
//   resetPassword,
//   updateUser,
// } from './user.controller.js';
// import {
//   loginValidationSchema,
//   registerUserValidationSchema,
//   updateUserValidationSchema,
// } from './user.validation.js';
// import jwt from 'jsonwebtoken';
// import { UserModel } from './user.model.js';

// const router = express.Router();

// router.post(
//   '/register',
//   validateRequest(registerUserValidationSchema),
//   registerUser,
// );
// router.post('/login', validateRequest(loginValidationSchema), loginUser);
// // router.post('/logout', adminMiddleware('user', 'admin'), logoutUser);
// router.post('/forget-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);

// // router.post('/verify-token', async (req, res) => {
// //   const token = req.headers.authorization?.split(' ')[1];

// //   // Log received token for debugging
// //   // console.log('Received token:', token);

// //   // Check if token is provided
// //   if (!token) {
// //     // console.error('No token provided');
// //     return res.status(401).json({ valid: false });
// //   }

// //   try {
// //     // Verify the token
// //     const decoded = jwt.verify(token, 'Envato');

// //     // Check if the token exists in the user's tokens array
// //     const user = await UserModel.findOne({
// //       _id: decoded.id,
// //       'tokens.token': token,
// //     });
// //     if (!user) {
// //       // console.error('Token not found in user records');
// //       return res.status(401).json({ valid: false });
// //     }

// //     // If everything is valid, return user data
// //     // console.log('Decoded token:', decoded);
// //     res.json({ valid: true, user: decoded });
// //   } catch (err) {
// //     // console.error('Token verification error:', err);
// //     return res.status(401).json({ valid: false });
// //   }
// // });

// router.put(
//   '/update/:userId',
//   //adminMiddleware('user'),.
//   validateRequest(updateUserValidationSchema),
//   updateUser,
// );

// router.delete('/delete/:userId', adminMiddleware('admin'), deleteUser);
// router.get(
//   '/admin-password/:userId',
//   adminMiddleware('admin'),
//   getAdminPassword,
// ); // Admin can login generating new password in any user account
// router.get('/user-list', adminMiddleware('admin'), getUserInfo);

// router.get('/information/:id', getSelfInfo);
// router.get('/user-stats', adminMiddleware('admin'), getUserStatistics);

// export default router;
