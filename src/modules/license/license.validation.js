import { z } from 'zod';

export const createLicenseValidationSchema = z.object({
  body: z.object({
    serviceName: z.string({
      required_error: 'serviceName is required!',
      invalid_type_error: 'serviceName must be a string!',
    }),
    user: z
      .string({
        invalid_type_error: 'serviceName must be a string!',
      })
      .optional(),
    dayLimit: z
      .number({
        required_error: 'dayLimit is required!',
        invalid_type_error: 'dayLimit must be a number!',
      })
      .min(0, { message: '0 is the minimum you can set' }),
    dailyLimit: z
      .number({
        required_error: 'dailyLimit is required!',
        invalid_type_error: 'dailyLimit must be a number!',
      })
      .min(0, { message: '0 is the minimum you can set' }),
    totalLimit: z
      .number({
        required_error: 'totalLimit is required!',
        invalid_type_error: 'totalLimit must be a number!',
      })
      .min(0, { message: '0 is the minimum you can set' }),
    licenseKey: z
      .string({
        required_error: 'serviceName is required!',
        invalid_type_error: 'serviceName must be a string!',
      })
      .optional(),
    status: z.enum(['new', 'used', 'expired']).optional(),
  }),
});

export const updateLicenseValidationSchema = z.object({
  body: z.object({
    serviceName: z
      .string({
        required_error: 'serviceName is required!',
        invalid_type_error: 'serviceName must be a string!',
      })
      .optional(),
    user: z
      .string({
        invalid_type_error: 'serviceName must be a string!',
      })
      .optional(),
    dayLimit: z
      .number({
        required_error: 'dayLimit is required!',
        invalid_type_error: 'dayLimit must be a number!',
      })
      .min(0, { message: '0 is the minimum you can set' })
      .optional(),
    dailyLimit: z
      .number({
        required_error: 'dailyLimit is required!',
        invalid_type_error: 'dailyLimit must be a number!',
      })
      .min(0, { message: '0 is the minimum you can set' })
      .optional(),
    totalLimit: z
      .number({
        required_error: 'totalLimit is required!',
        invalid_type_error: 'totalLimit must be a number!',
      })
      .min(0, { message: '0 is the minimum you can set' })
      .optional(),
    licenseKey: z
      .string({
        required_error: 'serviceName is required!',
        invalid_type_error: 'serviceName must be a string!',
      })
      .optional(),
    status: z.enum(['new', 'used', 'expired']).optional(),
  }),
});

export const activateLicenseValidationSchema = z.object({
  body: z.object({
    licenseKey: z.string({
      required_error: 'licenseKey is required!',
      invalid_type_error: 'licenseKey must be a string!',
    }),
  }),
});
