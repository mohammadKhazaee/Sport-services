const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
	'sport-services',
	'root',
	process.env.DATABASE_PASSWORD || '13771377',
	{ dialect: 'mysql', host: 'localhost', logging: false }
)

module.exports = sequelize
