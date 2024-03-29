const Sequelize = require('sequelize')

const sequelize = require('../utils/database')

const Facility = sequelize.define('facility', {
	facilityId: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
})

module.exports = Facility
