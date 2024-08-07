export const validateUserInput = (name, email, password) => {
  if (!name || !email || !password) {
    return { isOk: false, message: 'Please fill all the fields' };
  }
  if (!password?.length || password.length < 5) {
    return { isOk: false, message: 'Password must be at least 5 characters' };
  }
  return null;
};
import { z } from 'zod';

export const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'email is required!',
        invalid_type_error: 'email must be a string',
      })
      .email(),
    password: z.string({
      required_error: 'password is required!',
      invalid_type_error: 'password must be a string',
    }),
  }),
});

export const registerUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required!',
      invalid_type_error: 'name must be a string',
    }),
    email: z
      .string({
        required_error: 'email is required!',
        invalid_type_error: 'email must be a string',
      })
      .email(),
    password: z.string({
      required_error: 'password is required!',
      invalid_type_error: 'password must be a string',
    }),
    image: z.string({
      required_error: 'image is required!',
      invalid_type_error: 'image must be a string',
    }),
    phone: z
      .number({
        required_error: 'phone is required!',
        invalid_type_error: 'phone must be a number',
      })
      .optional(),
  }),
});

export const updateUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'name must be a string',
      })
      .optional(),
    email: z
      .string({
        invalid_type_error: 'email must be a string',
      })
      .email()
      .optional(),
    password: z
      .string({
        invalid_type_error: 'password must be a string',
      })
      .optional(),
    image: z
      .string({
        invalid_type_error: 'image must be a string',
      })
      .optional(),
    phone: z
      .number({
        invalid_type_error: 'phone must be a number',
      })
      .optional(),
    isActive: z
      .boolean({ invalid_type_error: 'isActive must be boolean' })
      .optional(),
  }),
});
