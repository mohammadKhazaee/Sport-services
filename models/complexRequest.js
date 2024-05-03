const { Sequelize, Model } = require('sequelize')

const sequelize = require('../utils/database')
const Complex = require('./complex')
const UpdateComplexData = require('./update-complex-data')

//  accept requests private funtions

async function acceptCreateRequest(request) {
	try {
		return await sequelize.transaction(async () => {
			await Complex.update({ verified: true }, { where: { complexId: request.complexId } })

			return await request.destroy()
		})
	} catch (error) {
		err.message = 'problem while accepting create complex request'
		throw err
	}
}

async function acceptDeleteRequest(request) {
	try {
		return await Complex.destroy({ where: { complexId: request.complexId } })
	} catch (error) {
		err.message = 'problem while accepting delete complex request'
		throw err
	}
}

async function acceptUpdateRequest(request) {
	try {
		return await sequelize.transaction(async () => {
			const requestData = await request.getUpdateCompleData()
			const updatedFields = JSON.parse(requestData.updated_fields)

			await Complex.update(updatedFields, { where: { complexId: request.complexId } })

			return await request.destroy()
		})
	} catch (error) {
		throw error
	}
}

//  send requests private funtions

async function sendCreateRequest(complexId) {
	try {
		return await ComplexRequest.create({
			complexId,
			type: 'create',
		})
	} catch (err) {
		Complex.destroy({
			where: {
				complexId,
			},
		})
		err.message = 'problem while sending create complex request'
		throw err
	}
}

async function sendDeleteRequest(complexId) {
	try {
		return await ComplexRequest.create({
			complexId,
			type: 'delete',
		})
	} catch (err) {
		err.message = 'problem while sending delete complex request'
		throw err
	}
}

async function sendUpdateRequest(complexId, updatedFields) {
	try {
		const request = await ComplexRequest.create({
			complexId,
			type: 'update',
		})
		await UpdateComplexData.create({
			complexRequestId: request.complexRequestId,
			updated_fields: JSON.stringify(updatedFields),
		})
	} catch (err) {
		ComplexRequest.destroy({
			where: {
				complexId,
			},
		})
		err.message = 'problem while sending update complex request'
		throw err
	}
}

class ComplexRequest extends Model {
	static sendRequest(complexId, type, option) {
		switch (type) {
			case 'create':
				return sendCreateRequest(complexId)
			case 'delete':
				return sendDeleteRequest(complexId)
			case 'update':
				return sendUpdateRequest(complexId, option.updatedFields)
			default:
				throw new Error('complex request type not supported')
		}
	}

	static async acceptRequest(requestId) {
		const request = await ComplexRequest.findByPk(requestId)

		switch (request.type) {
			case 'create':
				return acceptCreateRequest(request)
			case 'delete':
				return acceptDeleteRequest(request)
			case 'update':
				return acceptUpdateRequest(request)
			default:
				throw new Error('complex request type not supported')
		}
	}

	// static async rejectRequest(requestId) {
	// 	try {
	// 		return await sequelize.transaction(async () => {
	// 			const request = await ComplexRequest.findByPk(requestId)

	// 			return await Complex.detroy({ where: { complexId: request.complexId } })
	// 		})
	// 	} catch (error) {
	// 		throw error
	// 	}
	// }

	static async exists({ complexId }) {
		const whereClause = {}

		if (complexId) whereClause.complexId = complexId

		const count = await ComplexRequest.count({ where: whereClause })
		return count > 0
	}

	static fetchRequests({ type }) {
		const whereClause = {}

		if (type) whereClause.type = type

		return ComplexRequest.findAll({ where: whereClause })
	}
}

ComplexRequest.init(
	{
		complexRequestId: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		complexId: {
			type: Sequelize.UUID,
			allowNull: false,
			unique: true,
		},
		visited: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		type: {
			type: Sequelize.ENUM(['create', 'update', 'delete']),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'complex_request',
	}
)

module.exports = ComplexRequest
