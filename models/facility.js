const { Sequelize, Model } = require('sequelize')

const sequelize = require('../utils/database')

class Facility extends Model {}

Facility.init(
	{
		facilityId: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{
		sequelize,
		modelName: 'facility',
		timestamps: false,
	}
)

module.exports = Facility
