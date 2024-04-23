const express = require('express')

const authController = require('../controllers/auth')
const validator = require('../middlewares/validation')

const Router = express.Router()

// PUT /auth/signup
Router.put('/signup', validator.putSignup, authController.putSignup)

// POST /auth/login
Router.post('/login', validator.postLogin, authController.postLogin)

// PUT /auth/verify-number
Router.put('/verify-number', validator.putVerifyNumber, authController.putVerifyNumber)

// POST /auth/verify-number
Router.post('/verify-number', validator.postVerifyNumber, authController.postVerifyNumber)

// POST /auth/check-email
Router.post('/check-email', validator.postCheckEmail, authController.postCheckEmail)

// PATCH /auth/reset-password
Router.patch('/reset-password', validator.patchResetPassword, authController.patchResetPassword)

module.exports = Router
