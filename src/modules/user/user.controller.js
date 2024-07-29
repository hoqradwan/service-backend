import { UserModel } from './user.model.js';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from './user.service.js';
import { validateUserInput } from './user.validation.js';
import { generateToken, hashPassword } from './user.utils.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
      const validationError = validateUserInput(name, email, password);
   
      if (validationError) {
      return res.status(400).json(validationError);
    }

    const isUserRegistered = await findUserByEmail(email);
    if (isUserRegistered) {
      return res.status(400).json({
        isOk: false,
        message: "you have already an account."
      });
    }

    const isUserPresent = await findUserByEmail(email, UserModel);
    if (isUserPresent) {
      return res.status(400).json({
        isOk: false,
        message: "You have already an account."
      });
    }

    const hashedPassword = hashPassword(password);
    const { createdUser } = await createUser({
      name, email, hashedPassword, 
    });

    const token = generateToken({ name, email });
    
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return res.json({
      User: createdUser,
  
      isOk: true,
      message: "You are ready to move in the site"
    });
  } catch (error) {
    console.error("Error during User creation:", error);
    return res.status(500).json({ isOk: false, message: "Internal server error" });
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
          message: "This account does not exist."
        });
      }
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({
          isOk: false,
          message: "Invalid password."
        });
      }
  
      // Generate token
      const token = generateToken({ id: user._id, name: user.name, email: user.email });
  
      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
  
      return res.json({
        isOk: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
  
    } catch (error) {
      console.error("Error during user login:", error);
      return res.status(500).json({ isOk: false, message: "Internal server error" });
    }
  };