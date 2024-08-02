import httpStatus from 'http-status';

const handleCastError = (err) => {
  const errorSources = [{ path: err.path, message: err.message }];

  const statusCode = httpStatus.BAD_REQUEST;
  const result = {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
  return result;
};

export default handleCastError;
