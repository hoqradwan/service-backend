import { UserModel } from './user.model.js';
import bcrypt from 'bcrypt';
import {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
  updateUserById,
} from './user.service.js';
import { validateUserInput } from './user.validation.js';
import { generateToken, hashPassword } from './user.utils.js';
import { v4 as uuidv4 } from 'uuid';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, image } = req.body;

    const validationError = validateUserInput(name, email, password);

    if (validationError) {
      return res.status(400).json(validationError);
    }

    const isUserRegistered = await findUserByEmail(email);
    if (isUserRegistered) {
      return res.status(400).json({
        isOk: false,
        message: 'you have already an account.',
      });
    }

    //generate password for admin to logged in any user account
    const adminPassword = uuidv4().replace(/-/g, '').substring(0, 6);

    const hashedPassword = hashPassword(password);
    const { createdUser } = await createUser({
      name,
      email,
      hashedPassword,
      phone,
      adminPassword,
      image,
    });

    const token = generateToken({ name, email });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.json({
      User: createdUser,

      isOk: true,
      message: 'You are ready to move in the site',
    });
  } catch (error) {
    console.error('Error during User creation:', error);
    return res
      .status(500)
      .json({ isOk: false, message: 'Internal server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await findUserByEmail(email);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        isOk: false,
        message: 'This account does not exist.',
      });
    }

    // Verify regular password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Verify adminPassword
    const isAdminPasswordValid = password === user.adminPassword;

    if (!isPasswordValid && !isAdminPasswordValid) {
      return res.status(401).json({
        isOk: false,
        message: 'Invalid password.',
      });
    }

    // Generate token
    const token = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.json({
      isOk: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Error during user login:', error);
    return res
      .status(500)
      .json({ isOk: false, message: 'Internal server error' });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password, phone, image, isActive } = req.body;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        isOk: false,
        message: 'User not found.',
      });
    }

    // Create an update object and only add fields that are provided in the request body
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = hashPassword(password);
    if (phone) updateData.phone = phone;
    if (image) updateData.image = image;
    if (isActive) updateData.isActive = isActive;

    const updatedUser = await updateUserById(userId, updateData);

    return res.json({
      isOk: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res
      .status(500)
      .json({ isOk: false, message: 'Internal server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        isOk: false,
        message: 'User not found.',
      });
    }

    await deleteUserById(userId);

    return res.json({
      isOk: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res
      .status(500)
      .json({ isOk: false, message: 'Internal server error' });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      // If the user is an admin, return paginated users except the current admin
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;

      const users = await UserModel.find(
        { _id: { $ne: req.user.id }, role: { $ne: 'admin' } },
        '-password -adminPassword',
      )
        .skip(skip)
        .limit(limit);

      const totalUsers = await UserModel.countDocuments({
        _id: { $ne: req.user.id },
        role: { $ne: 'admin' },
      });

      // Fetch admin list and count
      const admins = await UserModel.find(
        { role: 'admin' },
        '-password -adminPassword',
      );
      const totalAdmins = admins.length;

      const totalPages = Math.ceil(totalUsers / limit);
      const currentPageUsers = users.length;

      return res.json({
        isOk: true,
        users: users,
        currentPage: page,
        totalPages: totalPages,
        totalUsers: totalUsers,
        currentPageUsers: currentPageUsers,

        admins: admins,
        totalAdmins: totalAdmins,
      });
    } else {
      // If not an admin, return only the requested user's info
      return res.status(404).json({
        isOk: false,
        message: 'Only admin can access all user list.',
      });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({
      isOk: false,
      message: 'Internal server error',
    });
  }
};

export const getSelfInfo = async (req, res) => {
  try {
    const user = await UserModel.findById(
      req.params.id,
      '-password -adminPassword',
    );
    if (!user) {
      return res.status(404).json({
        isOk: false,
        message: 'User not found.',
      });
    }
    return res.json({
      isOk: true,
      information: user,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({
      isOk: false,
      message: 'Internal server error',
    });
  }
};

export const getAdminPassword = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the requester is an admin

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        isOk: false,
        message: 'User not found.',
      });
    }

    return res.json({
      isOk: true,

      adminPassword: user.adminPassword,
    });
  } catch (error) {
    console.error('Error fetching admin password:', error);
    return res
      .status(500)
      .json({ isOk: false, message: 'Internal server error' });
  }
};
