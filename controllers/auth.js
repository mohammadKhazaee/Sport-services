const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Ghasedak = require('ghasedak')
require('dotenv').config()

const User = require('../models/user')
const PhoneVerification = require('../models/phone-verification')
const buildError = require('../utils/buildError')

exports.putSignup = async (req, res, next) => {
	const errors = validationResult(req).array()
	if (errors.length > 0) {
		let error = new Error('Validation failed.')
		error.statusCode = 422
		if (errors[0].msg.code) {
			error.message = errors[0].msg.message
			error.statusCode = errors[0].msg.code
		} else error.message = errors[0].msg
		return next(error)
	}

	const fName = req.body.fName
	const lName = req.body.lName
	const password = req.body.password
	const email = req.body.email
	const province = req.body.province
	const city = req.body.city
	const gender = req.body.gender
	const phoneNumber = req.body.phoneNumber
	const verifyCode = req.body.verifyCode
	try {
		const existedNumber = req.existedNumber
		if (!(existedNumber.verifyCode === verifyCode && existedNumber.verifyCodeExp > Date.now()))
			throw buildError('invalid code', 422)

		const hashedPw = await bcrypt.hash(password, 12)
		const createdUser = await User.create({
			phoneNumber,
			fName,
			lName,
			password: hashedPw,
			email,
			province,
			city,
			gender,
		})
		res.status(201).json({ message: 'User created!', userId: createdUser.userId })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.postLogin = async (req, res, next) => {
	const errors = validationResult(req).array()
	if (errors.length > 0) {
		let error = new Error('Validation failed.')
		error.statusCode = 422
		if (errors[0].msg.code) {
			error.message = errors[0].msg.message
			error.statusCode = errors[0].msg.code
		} else error.message = errors[0].msg
		return next(error)
	}

	try {
		const user = req.user
		const token = jwt.sign({ userId: user.userId.toString() }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		})
		const { password, updatedAt, createdAt, resetToken, resetTokenExp, ...responseUser } =
			user.dataValues
		res.status(200).json({ token: token, user: responseUser })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.putVerifyNumber = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			let error = new Error('Validation failed.')
			error.statusCode = 422
			if (errors[0].msg.code) {
				error.message = errors[0].msg.message
				error.statusCode = errors[0].msg.code
			}
			return next(error)
		}

		const phoneNumber = req.body.phoneNumber
		const param1 = 99999 + Math.ceil(900000 * Math.random())
		if (!req.existedNumber)
			PhoneVerification.create({
				phoneNumber,
				verifyCode: param1,
				verifyCodeExp: Date.now() + 60000 * 5,
			})
		else {
			req.existedNumber.set({
				verifyCode: param1,
				verifyCodeExp: Date.now() + 60000 * 5,
			})
			req.existedNumber.save()
		}

		const ghasedak = new Ghasedak(process.env.SMS_API_KEY)
		ghasedak.verification({
			receptor: phoneNumber,
			type: '1',
			template: 'verify',
			param1,
		})
		res.status(201).json({ message: 'sms has been sent' })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.postVerifyNumber = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			let error = new Error('Validation failed.')
			error.statusCode = 422
			if (errors[0].msg.code) {
				error.message = errors[0].msg.message
				error.statusCode = errors[0].msg.code
			} else error.message = errors[0].msg
			return next(error)
		}

		const existedNumber = req.existedNumber
		if (
			!(
				existedNumber.verifyCode === req.body.verifyCode && existedNumber.verifyCodeExp > Date.now()
			)
		)
			throw buildError('invalid code', 422)
		res.status(200).json({ message: 'valid code' })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.postCheckEmail = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			let error = new Error('Validation failed.')
			error.statusCode = 422
			if (errors[0].msg.code) {
				error.message = errors[0].msg.message
				error.statusCode = errors[0].msg.code
			} else error.message = errors[0].msg
			return next(error)
		}

		res.status(200).json({ message: 'valid email' })
	} catch (err) {
		console.log(err)
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}

exports.patchResetPassword = async (req, res, next) => {
	try {
		const errors = validationResult(req).array()
		if (errors.length > 0) {
			let error = new Error('Validation failed.')
			error.statusCode = 422
			if (errors[0].msg.code) {
				error.message = errors[0].msg.message
				error.statusCode = errors[0].msg.code
			} else error.message = errors[0].msg
			return next(error)
		}
		const newPassword = bcrypt.hashSync((Math.random() * 10).toString(), 8).substring(0, 10)
		const ghasedak = new Ghasedak(process.env.SMS_API_KEY)
		ghasedak.verification({
			receptor: req.body.phoneNumber,
			type: '1',
			template: 'verify',
			param1: newPassword,
		})
		const hashedPw = bcrypt.hashSync(newPassword, 12)
		req.existedUser.password = hashedPw
		req.existedUser.save()
		res.status(200).json({ message: 'password has been reset' })
	} catch (err) {
		console.log(err)
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}
