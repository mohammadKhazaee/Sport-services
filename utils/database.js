const { Sequelize } = require('sequelize')
require('dotenv').config()

// const sequelize = new Sequelize(
// 	process.env.DB_NAME || 'sport-services',
// 	process.env.DB_USERNAME || 'root',
// 	process.env.DB_PASSWORD || '13771377',
// 	{ dialect: 'mysql', host: process.env.DB_HOST || 'localhost', logging: false }
// )
const sequelize = new Sequelize(
	process.env.DB_URI || 'mysql://root:13771377@localhost:3306/sport-services',
	{ dialect: 'mysql', host: process.env.DB_HOST || 'localhost', logging: false }
)

module.exports = sequelize
