import { z } from 'zod';

export const validateUrlInput = (url) => {
  const urlPattern = new RegExp('https?://');
  return urlPattern.test(url);
};

export const createCookieValidationSchema = z.object({
  body: z.object({
    serviceName: z.string({
      required_error: 'serviceName is required!',
      invalid_type_error: 'serviceName must be a string',
    }),
    account: z.string({
      required_error: 'account is required!',
      invalid_type_error: 'account must be a string',
    }),
    project: z.string({
      required_error: 'project is required!',
      invalid_type_error: 'project must be a string',
    }),
    source: z.string({
      required_error: 'source is required!',
      invalid_type_error: 'source must be a string',
    }),
    cookie: z.string({
      required_error: 'cookie is required!',
      invalid_type_error: 'cookie must be a string',
    }),
    csrfToken: z.string({
      required_error: 'csrfToken is required!',
      invalid_type_error: 'csrfToken must be a string',
    }),
    status: z.enum(['active', 'inactive']),
  }),
});

export const updateCookieValidationSchema = z.object({
  body: z.object({
    serviceName: z.string({
      required_error: 'serviceName is required!',
      invalid_type_error: 'serviceName must be a string',
    }).optional(),
    account: z.string({
      required_error: 'account is required!',
      invalid_type_error: 'account must be a string',
    }).optional(),
    project: z.string({
      required_error: 'project is required!',
      invalid_type_error: 'project must be a string',
    }).optional(),
    source: z.string({
      required_error: 'source is required!',
      invalid_type_error: 'source must be a string',
    }).optional(),
    cookie: z.string({
      required_error: 'cookie is required!',
      invalid_type_error: 'cookie must be a string',
    }).optional(),
    csrfToken: z.string({
      required_error: 'csrfToken is required!',
      invalid_type_error: 'csrfToken must be a string',
    }).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});
