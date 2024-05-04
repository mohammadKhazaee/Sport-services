module.exports = (req, res, next) => {
	if (req.userId === 'admin') return next()
	const error = new Error('Not authorized.')
	error.statusCode = 403
	next(error)
}
