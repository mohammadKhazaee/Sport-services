const { Sequelize, Model } = require('sequelize')

const sequelize = require('../utils/database')
const Complex = require('./complex')

class ComplexRequest extends Model {
	static async sendRequest(complexId, type, option) {
		switch (type) {
			case 'create':
				return sendCreateRequest(complexId)
			default:
				throw new Error('request type not supported')
		}
	}

	static async sendCreateRequest(complexId) {
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
			if (!err.statusCode) throw new Error('problem while saving complex request')
			throw err
		}
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
