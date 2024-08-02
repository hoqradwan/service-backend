import httpStatus from 'http-status';

const handleValidationError = (error) => {
  let errorSources = [];
  errorSources = Object.values(error.errors).map((issue) => {
    return {
      path: issue.path,
      message: issue.message,
    };
  });
  const statusCode = httpStatus.BAD_REQUEST;
  const result = {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
  return result;
};

export default handleValidationError;
