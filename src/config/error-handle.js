// error-handler.js

const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const error = {
    message: message,
    status: statusCode,
  };

  res.status(statusCode).json({ error: error });
};

export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default errorHandler;
