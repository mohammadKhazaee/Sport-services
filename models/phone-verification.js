const { Sequelize, Model } = require('sequelize')

const sequelize = require('../utils/database')

class PhoneVerification extends Model {}

PhoneVerification.init(
	{
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
	},
	{
		sequelize,
		modelName: 'phone_verification',
	}
)
module.exports = PhoneVerification
