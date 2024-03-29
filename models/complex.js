const Sequelize = require('sequelize')

const sequelize = require('../utils/database')

const Complex = sequelize.define('complex', {
	complexId: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true,
	},
	registration_num: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
	sheba_num: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	size: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	province: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	city: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	address: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	minPrice: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: null,
	},
	maxPrice: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: null,
	},
	description: {
		type: Sequelize.STRING,
		allowNull: true,
		defaultValue: null,
	},
	score: {
		type: Sequelize.TINYINT,
		allowNull: false,
		defaultValue: 0,
	},
})

module.exports = Complex
