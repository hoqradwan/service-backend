import { loginIntoEvanto } from './auth.service.js';


export const login = async (req, res) => {
  try {
   const result = await loginIntoEvanto();
   res
      .status(200)
      .json({
        success: true,
        message: "Login Successful",
        data: result
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || 'Failed to login!',
      });
  }
};

