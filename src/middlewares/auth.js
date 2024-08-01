import httpStatus from 'http-status';
import config from '../config';
import { CustomError } from '../errors/CustomError';
import { jwtHelpers } from '../helpers/jwtHelpers';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new CustomError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt_access_secret,
    );
    const { email } = verifiedUser;

    const userData = await User.findUserByEmail(email);
    if (!userData) {
      throw new CustomError(httpStatus.NOT_FOUND, 'You are not authorized!');
    }
    if (requiredRoles.length && !requiredRoles.includes(userData.role)) {
      throw new CustomError(httpStatus.FORBIDDEN, 'Forbidden access');
    }

    req.user = verifiedUser;
    next();
  });
};

export default auth;
