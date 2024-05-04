const { body, query, param } = require('express-validator')
const bcrypt = require('bcryptjs')

const User = require('../models/user')
const Complex = require('../models/complex')
const PhoneVerification = require('../models/phone-verification')
const cities = require('../data/cities.json')
const provinces = require('../data/provinces.json')
const Category = require('../models/category')
const TimeHelper = require('../utils/timeHelper')
const ComplexRequest = require('../models/complexRequest')

const phoneNumberRegex = /^09[0-9]{9}$/
const englishRegex = /^[a-zA-Z ]+$/
const persianRegex =
	/^[ \u06A9\u06AF\u06C0\u06CC\u060C\u062A\u062B\u062C\u062D\u062E\u062F\u063A\u064A\u064B\u064C\u064D\u064E\u064F\u067E\u0670\u0686\u0698\u200C\u0621-\u0629\u0630-\u0639\u0641-\u0654]+$/
const complexSortOptions = ['PRICE_DESC', 'PRICE_ASC', 'SCORE_ASC', 'SCORE_DESC']
const sizeOptions = [5, 6, 7, 8, 9, 10, 11]
const sessionLengthOptions = [60, 75, 90, 120]
const registration_numberLength = 11
const uuidRegex = /[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}/
const requestTypes = ['create', 'update', 'delete']

exports.postLogin = [
	body('phoneNumber')
		.trim()
		.notEmpty()
		.withMessage('phone number is empty')
		.custom(async (phoneNumber, { req }) => {
			if (phoneNumber === process.env.ADMIN_PHONENUMBER) return true
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
			if (password === process.env.ADMIN_PASSWORD) return true
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
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 0,
	}),
	body('confirmPass')
		.trim()
		.custom((confirmPass, { req }) => {
			if (confirmPass !== req.body.password) throw { message: `passwords don't match`, code: 422 }
			return true
		}),
	body('fName')
		.trim()
		.notEmpty()
		.withMessage('first name is empty')
		.isLength({ min: 3 })
		.withMessage('first name is too short')
		.custom((fName) => {
			if (!(persianRegex.test(fName) || englishRegex.test(fName)))
				throw { message: 'first name can only contain farsi or english characters', code: 422 }
			return true
		}),
	body('lName')
		.trim()
		.notEmpty()
		.withMessage('last name is empty')
		.isLength({ min: 3 })
		.withMessage('last name is too short')
		.custom((lName) => {
			if (!(persianRegex.test(lName) || englishRegex.test(lName)))
				throw { message: 'last name can only contain farsi or english characters', code: 422 }
			return true
		}),
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

exports.patchResetPassword = [
	body('phoneNumber')
		.trim()
		.notEmpty()
		.withMessage('phoneNumber is empty')
		.custom(async (phoneNumber, { req }) => {
			if (!phoneNumberRegex.test(phoneNumber))
				throw { message: 'wrong phone number format', code: 422 }
			const existedUser = await User.findOne({ where: { phoneNumber } })
			if (!existedUser) throw { message: 'phone number doesnt exists', code: 404 }
			req.existedUser = existedUser
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

exports.admin = {
	request: {
		getComplexRequests: [query('type', 'invalid type').trim().optional().isIn(requestTypes)],
		deleteAcceptRequest: [
			param('requestId')
				.trim()
				.notEmpty()
				.withMessage('requestId is empty')
				.custom(async (requestId) => {
					if (!uuidRegex.test(requestId)) throw { message: 'requestId should be uuid', code: 401 }

					const request = await Complex.exists({ requestId })
					if (!request) throw { message: 'could not find the request', code: 404 }
				}),
		],
		deleteRejectRequest: [
			param('requestId')
				.trim()
				.notEmpty()
				.withMessage('requestId is empty')
				.custom(async (requestId) => {
					if (!uuidRegex.test(requestId)) throw { message: 'requestId should be uuid', code: 401 }

					const request = await Complex.exists({ requestId })
					if (!request) throw { message: 'could not find the request', code: 404 }
				}),
		],
	},
}

exports.complex = {
	getComlexes: [
		query('minPrice', 'invalid minPrice').trim().optional().isNumeric({ no_symbols: false }),
		query('maxPrice', 'invalid maxPrice').trim().optional().isNumeric({ no_symbols: false }),
		query('onlineRes', 'invalid onlineRes').trim().optional().isBoolean().toBoolean(),
		query('facilities', 'invalid facility ids')
			.trim()
			.optional()
			.custom((facilities) => {
				if (!facilities) return true
				const facilitiesArr = facilities.split(',').map((f) => +f.trim())
				for (const f of facilitiesArr)
					if (isNaN(f)) throw { message: 'wrong facilities filter', code: 422 }
				return true
			}),
		query('sortType', 'invalid sortType')
			.trim()
			.toUpperCase()
			.optional()
			.isIn(complexSortOptions)
			.customSanitizer((sortType) => {
				const sortParts = sortType.split('_')
				switch (sortParts[0]) {
					case 'PRICE':
						return ['maxPrice', sortParts[1]]
					case 'SCORE':
						return ['score', sortParts[1]]
				}
			}),
		query('city', 'invalid city')
			.trim()
			.optional()
			.custom((city) => {
				const foundCity = cities.find((c) => c.name === city)
				if (!foundCity) throw { message: 'wrong city', code: 422 }
				return true
			}),
		query('categoryId', 'invalid categoryId')
			.trim()
			.optional()
			.custom(async (categoryId) => {
				const foundCat = await Category.findByPk(categoryId)
				if (!foundCat) throw { message: 'wrong category', code: 422 }
				return true
			}),
		query('page', 'wrong page number').trim().optional().isNumeric({ no_symbols: true }),
		query('size')
			.trim()
			.optional()
			.custom(async (size) => {
				if (!sizeOptions.find((s) => s === +size)) throw { message: 'invalid size', code: 422 }
				return true
			})
			.customSanitizer((size) => +size),
	],
	request: {
		postCreateRequest: [
			body('name')
				.trim()
				.notEmpty()
				.withMessage('Name is empty')
				.isLength({ min: 5 })
				.withMessage('name is too short')
				.custom((name) => {
					if (!persianRegex.test(name))
						throw { message: 'name can only contain farsi characters', code: 422 }
					return true
				}),
			body('city')
				.trim()
				.notEmpty()
				.withMessage('city is empty')
				.custom((city) => {
					const foundCity = cities.find((c) => c.name === city)
					if (!foundCity) throw { message: 'wrong city', code: 422 }
					return true
				}),
			body('address').trim().notEmpty().withMessage('Address is empty'),
			body('registration_number')
				.trim()
				.notEmpty()
				.withMessage('Registration number is empty')
				.isLength({ min: registration_numberLength, max: registration_numberLength })
				.withMessage(`Registration number have to be ${registration_numberLength} digit long`)
				.isNumeric({ no_symbols: true })
				.withMessage('Registration number have to be number')
				.custom(async (registration_number) => {
					const isDup = await Complex.exists({ registration_number })
					if (isDup) throw { message: 'Registration number already exists', code: 409 }
					return true
				}),
			body('phone_number')
				.trim()
				.notEmpty()
				.withMessage('Phone number is empty')
				.custom(async (phone_number) => {
					if (!phoneNumberRegex.test(phone_number))
						throw { message: 'wrong phone number format', code: 422 }
					return true
				}),
			body('size').optional().isIn(sizeOptions).withMessage('Invalid size'),
			body('price').optional().isInt({ min: 0 }).withMessage('Invalid price'),
			body('openTime')
				.optional()
				.trim()
				.notEmpty()
				.withMessage('Open time is empty')
				.custom((openTime) => {
					if (!TimeHelper.isTime(openTime))
						throw { message: 'Open time has wrong format', code: 422 }
					return true
				}),
			body('closeTime')
				.optional()
				.trim()
				.notEmpty()
				.withMessage('Close time is empty')
				.custom((closeTime) => {
					if (!TimeHelper.isTime(closeTime))
						throw { message: 'Close time has wrong format', code: 422 }
					return true
				}),
			body('session_length')
				.optional()
				.isIn(sessionLengthOptions)
				.withMessage('Invalid session length'),
			body('description')
				.trim()
				.notEmpty()
				.withMessage('Description is empty')
				.isString()
				.withMessage('Description must be a string'),
			body('onlineRes').isBoolean().withMessage('onlineRes must be a boolean value'),
		],
		postRemoveRequest: [
			param('complexId')
				.trim()
				.notEmpty()
				.withMessage('complexId is empty')
				.custom(async (complexId) => {
					if (!uuidRegex.test(complexId)) throw { message: 'complexId should be uuid', code: 401 }

					const complex = await Complex.exists({ complexId, verified: true })
					if (!complex) throw { message: 'could not find the complex', code: 404 }

					const request = await ComplexRequest.exists({ complexId })
					if (request)
						throw { message: 'another request already submited for this complex', code: 409 }
					return true
				}),
		],
		postUpdateRequest: [
			param('complexId')
				.trim()
				.notEmpty()
				.withMessage('complexId is empty')
				.custom(async (complexId) => {
					if (!uuidRegex.test(complexId)) throw { message: 'complexId should be uuid', code: 401 }

					const complex = await Complex.exists({ complexId, verified: true })
					if (!complex) throw { message: 'could not find the complex', code: 404 }

					const request = await ComplexRequest.exists({ complexId })
					if (request)
						throw { message: 'another request already submited for this complex', code: 409 }

					return true
				}),
		],
	},
}
