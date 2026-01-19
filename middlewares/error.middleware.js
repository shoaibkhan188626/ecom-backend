import AppError from '../utils/appError.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof AppError)) {
    error = new AppError('Internal server error', 500);
  }

  const response = {
    status: error.status,
    message: error.message,
  };

  if (error.details) {
    response.details = error.details;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(error.statusCode).json(response);
};

export default errorHandler;
