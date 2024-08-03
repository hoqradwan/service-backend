import httpStatus from 'http-status';

const handleZodError = (err) => {
  const errorSources = err?.issues?.map((issue) => {
    const path = issue.path[issue?.path.length - 1].toString();
    return {
      path,
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

export default handleZodError;
