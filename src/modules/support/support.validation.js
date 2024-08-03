import { z } from 'zod';

export const createSupportValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required!',
      invalid_type_error: 'name must be a string',
    }),
    goToURL: z.string({
      required_error: 'goToURL is required!',
      invalid_type_error: 'goToURL must be a string',
    }),
    image: z.string({
      required_error: 'image is required!',
      invalid_type_error: 'image must be a string',
    }),
  }),
});

export const updateSupportValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'name is required!',
        invalid_type_error: 'name must be a string',
      })
      .optional(),
    goToURL: z
      .string({
        required_error: 'goToURL is required!',
        invalid_type_error: 'goToURL must be a string',
      })
      .optional(),
    image: z
      .string({
        required_error: 'image is required!',
        invalid_type_error: 'image must be a string',
      })
      .optional(),
  }),
});
