const { validationResult } = require('express-validator')

const User = require('../models/user')

exports.getIndex = async (req, res, next) => {
	try {
		res.status(200).json({ message: 'just nothing!' })
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	}
}
