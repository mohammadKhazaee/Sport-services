const { validationResult } = require('express-validator')

const Complex = require('../models/complex')
const { fetchComplexSchedules } = require('../models/exerciseSession')

exports.getListAll = async (req, res, next) => {
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
			minPrice,
			maxPrice,
			onlineRes,
			facilities,
			city,
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

exports.postComplex = async (req, res, next) => {
	try {
		res.status(200).json({ message: 'success' })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.getComplex = async (req, res, next) => {
	try {
		const complexId = req.params.complexId

		const complex = await Complex.fetchComplexById(complexId)

		res.status(200).json({ message: 'complex fetched', complex })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.getComplexSchedule = async (req, res, next) => {
	try {
		const complexId = req.params.complexId,
			{ page = 1 } = req.query
		const startOfWeek = new Date(new Date().setHours(0, 0, 0) + (page - 1) * 7 * 24 * 3600000)
		const endOfWeek = new Date(new Date().setHours(0, 0, 0) + page * 7 * 24 * 3600000)

		const schedules = await fetchComplexSchedules(complexId, startOfWeek, endOfWeek)

		res.status(200).json({ message: 'complex schedules fetched', schedules })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}
