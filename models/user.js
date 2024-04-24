const { Sequelize, Model } = require('sequelize')

const PhoneVerification = require('../models/phone-verification')
const sequelize = require('../utils/database')

class User extends Model {}

User.init(
	{
		userId: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		phoneNumber: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},
		sheba_number: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: null,
		},
		fName: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		lName: {
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
		gender: {
			type: Sequelize.ENUM(['male', 'female']),
			allowNull: false,
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		resetToken: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: null,
		},
		resetTokenExp: {
			type: Sequelize.BIGINT,
			allowNull: true,
			defaultValue: null,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: null,
			unique: true,
		},
	},
	{
		sequelize,
		modelName: 'User',
	}
)

User.addHook('afterCreate', (user) => {
	PhoneVerification.update(
		{ verifyCode: null, verifyCodeExp: null, verified: true },
		{
			where: {
				phoneNumber: user.phoneNumber,
			},
		}
	)
})

module.exports = User
