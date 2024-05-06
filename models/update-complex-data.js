const { Sequelize, Model } = require('sequelize')

const sequelize = require('../utils/database')
const Complex = require('./complex')

class UpdateComplexData extends Model {}

UpdateComplexData.init(
	{
		updateComplexDataId: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		complexRequestId: {
			type: Sequelize.UUID,
			allowNull: false,
			unique: true,
		},
		updated_fields: {
			type: Sequelize.JSON,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'update_complex_data',
	}
)

module.exports = UpdateComplexData
