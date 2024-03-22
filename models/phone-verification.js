const Sequelize = require('sequelize')

const sequelize = require('../utils/database')

const PhoneVerification = sequelize.define('phoneVerification', {
	phoneNumber: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		primaryKey: true,
	},
	verifyCode: {
		type: Sequelize.STRING,
		allowNull: true,
		defaultValue: null,
	},
	verifyCodeExp: {
		type: Sequelize.BIGINT,
		allowNull: true,
		defaultValue: null,
	},
	verified: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
})

module.exports = PhoneVerification
