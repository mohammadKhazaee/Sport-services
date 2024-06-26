const { validationResult } = require('express-validator')
const ComplexRequest = require('../../models/complexRequest')
const buildError = require('../../utils/buildError')

exports.getComplexRequests = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			const error = buildError(errors, 'invalid input.')
			return next(error)
		}

		const { page, type } = req.query

		const [requests, totalCount] = await Promise.all([
			ComplexRequest.fetchRequests({
				page,
				type,
			}),
			ComplexRequest.countAll({ type }),
		])

		res.status(200).json({ message: 'requests fetched', requests, totalCount })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.getComplexRequest = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			const error = buildError(errors, 'invalid input.')
			return next(error)
		}
		const requestId = req.params.requestId

		const request = await ComplexRequest.fetchById(requestId)
		if (!request) return next()

		res.status(200).json({ message: 'request fetched', request })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.deleteAcceptRequest = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			const error = buildError(errors, 'invalid input.')
			return next(error)
		}

		const requestId = req.params.requestId

		const result = await ComplexRequest.acceptRequest(requestId)

		res.status(200).json({ message: 'success', result })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.deleteRejectRequest = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			const error = buildError(errors, 'invalid input.')
			return next(error)
		}

		const requestId = req.params.requestId

		const result = await ComplexRequest.rejectRequest(requestId)

		res.status(200).json({ message: 'success', result })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}
