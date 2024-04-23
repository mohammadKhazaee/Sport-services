const { validationResult } = require('express-validator')

const Complex = require('../models/complex')
const { fetchComplexSchedules } = require('../models/exerciseSession')

exports.getComplexes = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			let error = new Error('wrong query param.')
			error.statusCode = 422
			if (errors[0].msg.code) {
				error.message = errors[0].msg.message
				error.statusCode = errors[0].msg.code
			} else error.message = errors[0].msg
			return next(error)
		}

		const { minPrice, maxPrice, onlineRes, facilities, city, size, categoryId, sortType, page } =
			req.query

		const complexs = await Complex.getComplexes({
			verified: true,
			minPrice,
			maxPrice,
			onlineRes,
			facilities,
			city,
			size,
			categoryId,
			sortType,
			page,
		})
		const totalCount = await Complex.countAll()

		res.status(200).json({ message: 'complexes fetched', complexs, totalCount })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.putComplex = async (req, res, next) => {
	try {
		const {
			name,
			categories,
			city,
			address,
			size,
			onlineRes,
			price,
			openTime,
			closeTime,
			session_length,
			facilities,
			description,
			phone_number,
		} = req.body

		const complex = new Complex({
			name,
			city,
			address,
			size,
			onlineRes,
			price,
			openTime,
			closeTime,
			session_length: session_length.toString(),
			description,
			phone_number,
			userId: req.userId,
		})
		await complex.save({ facilities, categories })

		res.status(200).json({ message: 'complex created', complex })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.getComplex = async (req, res, next) => {
	try {
		const complex = await Complex.fetchComplexById(req.params.complexId)

		res.status(200).json({ message: 'complex fetched', complex })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.getComplexSchedule = async (req, res, next) => {
	try {
		const complexId = req.params.complexId

		const schedules = await fetchComplexSchedules(complexId)

		res.status(200).json({ message: 'complex schedules fetched', schedules })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}
