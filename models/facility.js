const Sequelize = require('sequelize')

const sequelize = require('../utils/database')

const Facility = sequelize.define(
	'facility',
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
	{ timestamps: false }
)

module.exports = Facility
