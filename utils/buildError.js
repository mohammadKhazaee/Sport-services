const { validationResult } = require('express-validator')

module.exports = (errors, msg, statusCode = 422) => {
	const error = new Error(msg)
	error.statusCode = statusCode
	if (errors[0].msg.code) {
		error.message = errors[0].msg.message
		error.statusCode = errors[0].msg.code
	} else error.message = errors[0].msg
	return error
}
