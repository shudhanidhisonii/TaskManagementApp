
export class AppError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors; 
  }
}

export const notFoundHandler = (req, res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
    });
  }
  if (err instanceof AppError) {
    const body = { success: false, message: err.message };
    if (err.errors.length > 0) body.errors = err.errors;
    return res.status(err.statusCode).json(body);
  }
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ success: false, message: err.message });
  }
  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};