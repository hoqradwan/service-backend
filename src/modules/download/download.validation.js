import { z } from 'zod';

export const storeDownloadValidationSchema = z.object({
  body: z.object({
    service: z.string({
      required_error: 'service is required!',
      invalid_type_error: 'service must be a string!',
    }),
    content: z.string({
      required_error: 'content is required!',
      invalid_type_error: 'content must be a string!',
    }),
    contentLicense: z.string({
      required_error: 'contentLicense is required!',
      invalid_type_error: 'contentLicense must be a string!',
    }),
    serviceId: z.string({
      required_error: 'serviceId is required!',
      invalid_type_error: 'serviceId must be a string!',
    }),
    licenseId: z.string({
      required_error: 'licenseId is required!',
      invalid_type_error: 'licenseId must be a string!',
    }),
    status: z.enum(['pending', 'accepted']),
  }),
});

export const downloadValidationSchema = z.object({
  body: z.object({
    url: z.string({
      required_error: 'url is required!',
      invalid_type_error: 'url must be a string!',
    }),
  }),
});
