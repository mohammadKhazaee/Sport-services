const { validationResult } = require('express-validator')
const Complex = require('../../models/complex')
const ComplexRequest = require('../../models/complexRequest')
const buildError = require('../../utils/buildError')

exports.getRequests = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			const error = buildError(errors, 'invalid input.')
			return next(error)
		}

		const { page, type } = req.query
		const userId = req.userId

		const [requests, totalCount] = await Promise.all([
			ComplexRequest.fetchRequests({
				page,
				type,
				userId,
			}),
			ComplexRequest.countAll({ type, userId }),
		])

		res.status(200).json({ message: 'requests fetched', requests, totalCount })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.getRequest = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			const error = buildError(errors, 'invalid input.')
			return next(error)
		}
		const requestId = req.params.requestId
		const ownsRequest = await ComplexRequest.exists({ requestId, userId: req.userId })
		if (!ownsRequest) {
			const error = new Error('Not Authorized')
			error.statusCode = 403
			throw error
		}

		const request = await ComplexRequest.fetchById(requestId)

		res.status(200).json({ message: 'request fetched', request })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.postCreateRequest = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			const error = buildError(errors, 'invalid input.')
			return next(error)
		}

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
			registration_number,
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
			phoneNumber: phone_number,
			registration_number,
			userId: req.userId,
		})
		const complexDoc = await complex.save({ facilities, categories })
		await ComplexRequest.sendRequest(complexDoc.complexId, 'create')

		res.status(201).json({ message: 'complex creation request sent', complex })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.postRemoveRequest = async (req, res, next) => {
	try {
		const complexId = req.params.complexId
		const ownsComplex = await Complex.exists({ complexId, userId: req.userId })
		if (!ownsComplex) {
			const error = new Error('Not Authorized')
			error.statusCode = 403
			throw error
		}

		const errors = validationResult(req).array()
		if (errors.length > 0) {
			const error = buildError(errors, 'invalid input.')
			return next(error)
		}

		await ComplexRequest.sendRequest(complexId, 'delete')

		res.status(201).json({ message: 'complex deletion request sent' })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.postUpdateRequest = async (req, res, next) => {
	try {
		const complexId = req.params.complexId
		const ownsComplex = await Complex.exists({ complexId, userId: req.userId })
		if (!ownsComplex) {
			const error = new Error('Not Authorized')
			error.statusCode = 403
			throw error
		}

		const errors = validationResult(req).array()
		if (errors.length > 0) {
			const error = buildError(errors, 'invalid input.')
			return next(error)
		}

		const {
			name,
			city,
			address,
			size,
			onlineRes,
			price,
			openTime,
			closeTime,
			session_length,
			description,
			phone_number,
			registration_number,
			facilities,
			categories,
		} = req.body

		const updatedFields = {}
		if (name) updatedFields.name = name
		if (city) updatedFields.city = city
		if (address) updatedFields.address = address
		if (onlineRes) updatedFields.onlineRes = onlineRes
		if (price) updatedFields.price = price
		if (size) updatedFields.size = size
		if (openTime) updatedFields.openTime = openTime
		if (closeTime) updatedFields.closeTime = closeTime
		if (session_length) updatedFields.session_length = session_length
		if (description) updatedFields.description = description
		if (phone_number) updatedFields.phone_number = phone_number
		if (registration_number) updatedFields.registration_number = registration_number
		if (facilities) updatedFields.facilities = structuredClone(facilities)
		if (categories) updatedFields.categories = structuredClone(categories)

		await ComplexRequest.sendRequest(req.params.complexId, 'update', {
			updatedFields,
		})

		res.status(201).json({ message: 'update complex request sent' })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}
