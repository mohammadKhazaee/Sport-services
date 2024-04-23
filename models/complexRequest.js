const { Sequelize, Model } = require('sequelize')

const sequelize = require('../utils/database')
const Complex = require('./complex')

class ComplexRequest extends Model {
	static async sendRequest(complexId) {
		try {
			return await ComplexRequest.create({
				complexId,
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
		status: {
			type: Sequelize.ENUM(['new', 'in_progress', 'processed']),
			allowNull: false,
			defaultValue: 'new',
		},
	},
	{
		sequelize,
		modelName: 'complex_request',
	}
)

module.exports = ComplexRequest
