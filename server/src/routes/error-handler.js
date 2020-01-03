// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const code = err.code || 500
  const error = err.error || 'Internal server error'

  console.error(err.error || err.message)
  res.status(code).json({ error })
}

module.exports = errorHandler
