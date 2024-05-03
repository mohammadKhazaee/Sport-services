const { Sequelize, Model } = require('sequelize')

const sequelize = require('../utils/database')
const Complex = require('./complex')
const UpdateComplexData = require('./update-complex-data')

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
		throw new Error('problem while sending create complex request')
	}
}

async function sendDeleteRequest(complexId) {
	try {
		return await ComplexRequest.create({
			complexId,
			type: 'delete',
		})
	} catch (err) {
		throw new Error('problem while sending delete complex request')
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
		throw new Error('problem while sending update complex request')
	}
}

class ComplexRequest extends Model {
	static async sendRequest(complexId, type, option) {
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
