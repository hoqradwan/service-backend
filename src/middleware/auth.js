import jwt from 'jsonwebtoken';
import { UserModel } from '../modules/user/user.model.js';

export const adminMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const user = await UserModel.findOne({
        _id: decoded.id,
        'tokens.token': token,
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found!' });
      }

      req.token = token;
      req.user = user;
      req.userId = user._id;

      // Role-based authorization
      if (requiredRole && user.role !== requiredRole) {
        return res
          .status(403)
          .json({ success: false, message: 'Access denied' });
      }

      next();
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid token' });
    }
  };
};

// import jwt from 'jsonwebtoken';

// export const adminMiddleware = (role) => {
//   return (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res
//         .status(401)
//         .json({ success: false, message: 'Access denied. No token provided.' });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//       req.user = decoded; // Attach user data to request object..

//       // Check if the user is admin
//       if (role && req?.user?.role === 'admin') {
//         return next();
//       }
//       // Check if the user has the required role
//       if (role && req?.user.role !== role) {
//         return res.status(403).json({
//           success: false,
//           message: 'You are not authorized',
//         });
//       }
//       next();
//     } catch (error) {
//       res.status(400).json({ success: false, message: 'Invalid token...' });
//     }
//   };
// };
