import httpStatus from "http-status";
import sendError from "../utils/sendError.js";

const globalErrorHandler = (error, req, res, next) => {
  let statusCode = httpStatus.BAD_REQUEST;
  let message = error?.message || "Something went wrong";
  let errorSources = [];

  // if (error.name === "ZodError") {
  //   const simplifiedError = handleZodError(error);
  //   message = simplifiedError?.message;
  //   statusCode = simplifiedError?.statusCode;
  //   errorSources = simplifiedError?.errorSources;
  // } else if (error.name === "ValidationError") {
  //   const simplifiedError = handleValidationError(error);
  //   message = simplifiedError?.message;
  //   statusCode = simplifiedError?.statusCode;
  //   errorSources = simplifiedError?.errorSources;
  // } else if (error.name === "CastError") {
  //   const simplifiedError = handleCastError(error);
  //   errorSources = simplifiedError?.errorSources;
  //   message = simplifiedError?.message;
  //   statusCode = simplifiedError?.statusCode;
  // } else if (error.code === 11000) {
  //   const simplifiedError = handleDuplicateError(error);
  //   statusCode = simplifiedError?.statusCode;
  //   message = simplifiedError?.message;
  //   errorSources = simplifiedError?.errorSources;
  // } else if (error instanceof CustomError) {
  //   statusCode = error.statusCode;
  //   message = error.message;
  //   errorSources = [
  //     {
  //       path: "",
  //       message: error.message,
  //     },
  //   ];
  // } else if (error instanceof Error) {
  //   message = error?.message;
  //   errorSources = [
  //     {
  //       path: "",
  //       message: error.message,
  //     },
  //   ];
  // }

  const errorData = {
    message,
    error,
    errorSources,
  };
  return sendError(res, statusCode, errorData);

};

export default globalErrorHandler;
