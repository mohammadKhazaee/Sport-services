const { validationResult } = require('express-validator')

const Complex = require('../../models/complex')
const { fetchComplexSchedules } = require('../../models/exerciseSession')
const buildError = require('../../utils/buildError')

exports.getComplexes = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			const error = buildError(errors, 'wrong query param.')
			return next(error)
		}

		const { minPrice, maxPrice, onlineRes, facilities, city, size, categoryId, sortType, page } =
			req.query
		const filters = {
			verified: false,
			minPrice,
			maxPrice,
			onlineRes,
			facilities,
			city,
			size,
			categoryId,
		}
		const [complexes, totalCount] = await Promise.all([
			Complex.getComplexes(filters, {
				sortType,
				page,
			}),
			Complex.countAll(filters),
		])

		res.status(200).json({ message: 'complexes fetched', complexes, totalCount })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.getComplex = async (req, res, next) => {
	try {
		const complex = await Complex.fetchComplexById(req.params.complexId)

		if (!complex || (complex && complex.length === 0)) return next()
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

		if (!schedules || (schedules && schedules.length === 0)) return next()
		res.status(200).json({ message: 'complex schedules fetched', schedules })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}
