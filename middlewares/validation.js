const { body, query, param } = require('express-validator')
const bcrypt = require('bcryptjs')

const User = require('../models/user')
const PhoneVerification = require('../models/phone-verification')
const cities = require('../data/cities.json')
const provinces = require('../data/provinces.json')
const throwError = require('../utils/throwError')

const phoneNumberRegex = /\b09[0-9]{9}\b/

exports.postLogin = [
	body('phoneNumber')
		.trim()
		.notEmpty()
		.withMessage('phone number is empty')
		.custom(async (phoneNumber, { req }) => {
			if (!phoneNumberRegex.test(phoneNumber))
				throw { message: 'wrong phone number format', code: 422 }
			const user = await User.findOne({ where: { phoneNumber } })
			if (!user) throw { message: 'phone number or password is wrong', code: 401 }
			req.user = user
			return true
		}),
	body('password')
		.trim()
		.notEmpty()
		.withMessage('passowrd is empty')
		.custom(async (password, { req }) => {
			const isMatch = bcrypt.compareSync(password, req.user.password)
			if (!isMatch) throw { message: `phone number or password is wrong`, code: 401 }
			return true
		}),
]

exports.putSignup = [
	body('email')
		.trim()
		.notEmpty()
		.withMessage('email is empty!')
		.isEmail()
		.withMessage('wrong email format.')
		.normalizeEmail({ gmail_remove_dots: false })
		.custom(async (email) => {
			const user = await User.findOne({ where: { email } })
			if (user) throw { message: 'E-Mail address already exists!', code: 409 }
		}),
	body('password', 'password is not strong enough').trim().isStrongPassword({
		minLength: 8,
		minLowercase: 0,
		minUppercase: 0,
		minNumbers: 0,
		minSymbols: 0,
	}),
	body('confirmPass')
		.trim()
		.custom(async (confirmPass, { req }) => {
			if (confirmPass !== req.body.password) throw { message: `passwords don't match`, code: 422 }
			return true
		}),
	body('fName')
		.trim()
		.notEmpty()
		.withMessage('first name is empty')
		.isLength({ min: 3 })
		.withMessage('first name is too short')
		.isAlpha()
		.withMessage('first name should be english character'),
	body('lName')
		.trim()
		.notEmpty()
		.withMessage('last name is empty')
		.isLength({ min: 3 })
		.withMessage('last name is too short')
		.isAlpha()
		.withMessage('last name should be english character'),
	body('province')
		.trim()
		.notEmpty()
		.withMessage('province is empty')
		.custom((province, { req }) => {
			const foundProvince = provinces.find((p) => p.name === province)
			if (!foundProvince) throw { message: 'wrong province', code: 422 }
			req.province = foundProvince
			return true
		}),
	body('city')
		.trim()
		.notEmpty()
		.withMessage('city is empty')
		.custom((city, { req }) => {
			const foundCity = cities.find((c) => c.name === city && c.province_id === req.province.id)
			if (!foundCity) throw { message: 'wrong city', code: 422 }
			return true
		}),
	body('gender').trim().notEmpty().withMessage('gender is empty').isIn(['male', 'female']),
	body('phoneNumber')
		.trim()
		.notEmpty()
		.withMessage('phoneNumber is empty')
		.custom(async (phoneNumber, { req }) => {
			if (!phoneNumberRegex.test(phoneNumber))
				throw { message: 'wrong phone number format', code: 422 }
			const existedNumber = await PhoneVerification.findByPk(phoneNumber)
			if (!existedNumber) throw { message: 'verification code has not been sent yet', code: 404 }
			if (existedNumber.verified)
				throw { message: 'another account with this number exists', code: 409 }
			req.existedNumber = existedNumber
			return true
		}),
	body('verifyCode').trim().notEmpty().withMessage('verifyCode is empty'),
]

exports.putVerifyNumber = [
	body('phoneNumber')
		.trim()
		.notEmpty()
		.withMessage('phoneNumber is empty')
		.custom(async (phoneNumber, { req }) => {
			if (!phoneNumberRegex.test(phoneNumber))
				throw { message: 'wrong phone number format', code: 422 }
			const existedNumber = await PhoneVerification.findByPk(phoneNumber)
			if (existedNumber && existedNumber.verified)
				throw { message: 'phone number already exists', code: 409 }
			req.existedNumber = existedNumber
			return true
		}),
]

exports.postVerifyNumber = [
	body('phoneNumber')
		.trim()
		.notEmpty()
		.withMessage('phoneNumber is empty')
		.custom(async (phoneNumber, { req }) => {
			if (!phoneNumberRegex.test(phoneNumber))
				throw { message: 'wrong phone number format', code: 422 }
			const existedNumber = await PhoneVerification.findByPk(phoneNumber)
			if (!existedNumber) throw { message: 'phone number doesnt exists', code: 404 }
			req.existedNumber = existedNumber
			return true
		}),
	body('verifyCode').trim().notEmpty().withMessage('verifyCode is empty'),
]

exports.postCheckEmail = [
	body('email')
		.trim()
		.notEmpty()
		.withMessage('email is empty!')
		.isEmail()
		.withMessage('wrong email format.')
		.normalizeEmail({ gmail_remove_dots: false })
		.custom(async (email) => {
			const user = await User.findOne({ where: { email } })
			if (user) throw { message: 'E-Mail address already exists!', code: 409 }
		}),
]
