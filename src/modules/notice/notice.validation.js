import { z } from 'zod';

export const createNoticeValidationSchema = z.object({
  body: z.object({
    active: z.boolean({
      required_error: 'active is required!',
      invalid_type_error: 'active must be a boolean',
    }),

    message: z.string({
      required_error: 'message is required!',
      invalid_type_error: 'message must be a string',
    }),

    service: z.string({
      required_error: 'service is required!',
      invalid_type_error: 'service must be a string',
    }),
  }),
});

export const updateNoticeValidationSchema = z.object({
  body: z.object({
    active: z
      .boolean({
        required_error: 'active is required!',
        invalid_type_error: 'active must be a boolean',
      })
      .optional(),

    message: z
      .string({
        required_error: 'message is required!',
        invalid_type_error: 'message must be a string',
      })
      .optional(),

    service: z
      .string({
        required_error: 'service is required!',
        invalid_type_error: 'service must be a string',
      })
      .optional(),
  }),
});
