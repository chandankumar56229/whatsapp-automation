export function notFound(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(err, _req, res, _next) {
  console.error('[error]', err.message);
  const status = err.status || (err.name === 'ValidationError' ? 400 : 500);
  res.status(status).json({ error: err.message || 'Server error' });
}
