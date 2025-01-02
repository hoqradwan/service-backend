import jwt from 'jsonwebtoken';
import { UserModel } from '../modules/user/user.model.js';
import { ActiveDeviceModel } from '../modules/activeDevice/activeDevice.model.js';

export const adminMiddleware = (...requiredRoles) => {
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
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found!' });
      }

      const activeDevice = await ActiveDeviceModel.findOne({
        userId: decoded.id,
        deviceId: decoded.deviceId,
        token,
      });

      if (!activeDevice) {
        return res
          .status(403)
          .send('Token is invalid or device is logged out.');
      }

      req.token = token;
      req.user = user;
      req.userId = user._id;
      req.deviceId = decoded.deviceId;

      // Role-based authorization: Check if user has one of the required roles
      if (requiredRoles?.length && !requiredRoles?.includes(user.role)) {
        return res
          .status(403)
          .json({ success: false, message: 'Access denied' });
      }

      next();
    } catch (error) {
      res?.status(400)?.json({ success: false, message: 'Invalid token' });
    }
  };
};
