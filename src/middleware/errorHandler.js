// Custom error class for errors we expect (validation problems, missing tasks, etc.)
export class AppError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors; // optional list of detailed messages
  }
}

// Runs when no route matched the request -> forwards a 404 to the error handler
export const notFoundHandler = (req, res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Centralized error handler (Express recognizes it by its 4 parameters)
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Invalid JSON sent by the client (thrown by express.json())
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
    });
  }

  // Errors we created on purpose
  if (err instanceof AppError) {
    const body = { success: false, message: err.message };
    if (err.errors.length > 0) body.errors = err.errors;
    return res.status(err.statusCode).json(body);
  }

  // Other client errors raised by Express middleware (e.g. payload too large)
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ success: false, message: err.message });
  }

  // Anything else is an unexpected server error
  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};