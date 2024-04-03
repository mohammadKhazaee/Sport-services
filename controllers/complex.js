const { validationResult } = require('express-validator')

const Complex = require('../models/complex')

exports.getListAll = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			let error = new Error('Validation failed.')
			error.statusCode = 422
			if (errors[0].msg.code) {
				error.message = errors[0].msg.message
				error.statusCode = errors[0].msg.code
			} else error.message = errors[0].msg
			return next(error)
		}

		const { minPrice, maxPrice, onlineRes, facilities, sortType, city, size, categoryId } =
			req.query
		console.log(req.query)
		const complexs = await Complex.getComplexes({
			minPrice,
			maxPrice,
			onlineRes,
			facilities,
			city,
			categoryId,
			sortType,
		})

		res.status(200).json({ message: 'complexes fetched', complexs })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.postComplex = async (req, res, next) => {
	try {
		res.status(200).json({ message: 'success' })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}
