// import { UserModel } from "../modules/user/user.model.js";


// export const adminMiddleware = async (req, res, next) => {
//     try {
//         const userId = req.params.id;

//         const user = await UserModel.findById(userId);

//         if (!user) {
//             return res.status(404).json({
//                 isOk: false,
//                 message: "User not found."
//             });
//         }

//         if (user.role === 'admin') {
//             // User is an admin
//             req.isAdmin = true;
//         } else {
//             // User is not an admin
//             req.isAdmin = false;
//         }

//         req.userId = userId;
//         next();
//     } catch (error) {
//         console.error("Error in admin middleware:", error);
//         return res.status(500).json({
//             isOk: false,
//             message: "Internal server error"
//         });
//     }
// };..,

import jwt from 'jsonwebtoken';

export const adminMiddleware = (role) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
     // console.log(decoded);
      req.user = decoded; // Attach user data to request object

      // Check if the user has the required role
      if (role && req.user.role !== role) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized',
        });
      }

      next();
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid token...' });
    }
  };
};
