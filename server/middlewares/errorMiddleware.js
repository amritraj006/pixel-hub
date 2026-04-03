function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  const statusCode =
    err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const message = err.message || 'Internal server error';

  if (statusCode < 500) {
    return res.status(statusCode).json({ error: message });
  }

  console.error(err);
  return res.status(500).json({ error: message });
}

module.exports = {
  notFound,
  errorHandler,
};
