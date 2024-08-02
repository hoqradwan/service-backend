import { z } from 'zod';

export const createBannerValidationSchema = z.object({
  body: z.object({
    fileName: z.string({
      required_error: 'fileName is required!',
      invalid_type_error: 'fileName must be a string',
    }),
    goToURL: z.string({
      required_error: 'goToURL is required!',
      invalid_type_error: 'goToURL must be a string',
    }),
    side: z.enum(['left', 'right'])
  }),
});
export const updateBannerValidationSchema = z.object({
  body: z.object({
    fileName: z.string({
      required_error: 'fileName is required!',
      invalid_type_error: 'fileName must be a string',
    }).optional(),
    goToURL: z.string({
      required_error: 'goToURL is required!',
      invalid_type_error: 'goToURL must be a string',
    }).optional(),
    side: z.enum(['left', 'right']).optional()
  }),
});

