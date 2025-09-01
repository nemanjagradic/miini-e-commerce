const AppError = require("../utils/appError");

const handleDuplicateErrorDB = (err) => {
  const fieldName = Object.keys(err.keyValue)[0];
  const value = Object.values(err.keyValue)[0];
  return new AppError(
    `A user with the ${fieldName}: "${value}" already exists. Please use a different one.`,
    400
  );
};

const handleCastErrorDB = (err) => {
  const message = `A product with ${err.path} of ${err.value} is not found.`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input data. ${errors.join(" ")}`, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);
const handleTokenExpiredError = () =>
  new AppError("Your token has expired. Please log in again!", 401);

const sendErrorDev = (res, err) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (res, err) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error("ERROR 💥", err);
  return res.status(500).json({
    status: "error",
    message: "Something went very wrong.",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(res, err);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);

    if (err.code === 11000) error = handleDuplicateErrorDB(error);
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.name === "ValidationError") error = handleValidationError(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleTokenExpiredError();

    sendErrorProd(res, error);
  }
};

module.exports = globalErrorHandler;
