import { z } from 'zod';

export const createBannerValidationSchema = z.object({
  body: z.object({
    fileName: z.string({
      required_error: 'name is required!',
      invalid_type_error: 'name must be a string',
    }),
    goToURL: z.string({
      required_error: 'image is required!',
      invalid_type_error: 'image must be a string',
    }),
    side: z.enum(['left', 'right'])
  }),
});
export const updateBannerValidationSchema = z.object({
  body: z.object({
    fileName: z.string({
      required_error: 'name is required!',
      invalid_type_error: 'name must be a string',
    }).optional(),
    goToURL: z.string({
      required_error: 'image is required!',
      invalid_type_error: 'image must be a string',
    }).optional(),
    side: z.enum(['left', 'right']).optional()
  }),
});

