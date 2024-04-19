require('dotenv').config()

module.exports = {
	development: {
		username: 'root',
		password: '13771377',
		database: 'sport-services',
		host: 'localhost',
		dialect: 'mysql',
		port: 3306,
	},
	test: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: 'mysql',
		port: 3306,
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: 'mysql',
		port: 3306,
	},
}
