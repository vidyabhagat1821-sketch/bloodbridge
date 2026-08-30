export function errorHandler(err, req, res, next) {
  console.error(`❌ [Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);

  // Return clean, safe error messages without leaking sensitive stack traces
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal error occurred on the server.',
    errorType: err.name || 'InternalError'
  });
}
