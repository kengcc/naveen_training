export function errorHandler(error, _req, res, _next) {
  const statusCode = error?.statusCode || 500;
  res.status(statusCode).json({
    message: error?.message || 'Internal server error',
    code: error?.code || 'INTERNAL_SERVER_ERROR'
  });
}
