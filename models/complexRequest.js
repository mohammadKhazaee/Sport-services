const { Sequelize, Model } = require('sequelize')

const sequelize = require('../utils/database')

class ComplexRequest extends Model {}

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
