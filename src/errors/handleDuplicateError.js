import httpStatus from "http-status";

const handleDuplicateError = (err) => {
  // Extract value within double quotes using regex;
  const match = err.message.match(/"([^"]*)"/);
  // The extracted value will be in the first capturing group;
  const extractedMessage = match && match[1];

  const path = Object.keys(err.keyValue || {})[0];

  const errorSources = [
    {
      path,
      message: `${extractedMessage} already exists!`,
    },
  ];
  const statusCode = httpStatus.BAD_REQUEST;
  const result = {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
  return result;
};

export default handleDuplicateError;
