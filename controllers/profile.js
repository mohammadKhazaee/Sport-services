const { validationResult } = require('express-validator')
const Complex = require('../models/complex')

exports.getComplexes = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			const error = buildError(errors, 'invalid query.')
			return next(error)
		}
		const page = req.query.page

		const complexes = await Complex.getComplexes({ userId: req.userId }, { page })

		res.status(200).json({ message: 'complexes fetched', complexes })
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500
		next(error)
	}
}
