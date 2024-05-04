const express = require('express')

const authRouter = require('./auth')
const profileRouter = require('./profile')
const adminRouter = require('./admin/admin')
const complexRouter = require('./complex/complex')
const mainRouter = require('./main')
const isAdmin = require('../middlewares/is-admin')
const isAuth = require('../middlewares/is-auth')

const Router = express.Router()

Router.use('/profile', isAuth, profileRouter)
Router.use('/admin', isAuth, isAdmin, adminRouter)
Router.use('/auth', authRouter)
Router.use('/complex', complexRouter)
Router.use(mainRouter)

// Handle not found routes
Router.use((req, res, next) => {
	res.status(404).json({ message: 'Page or Resource Not Found' })
})

// Handles server-side errors
Router.use((error, req, res, next) => {
	const status = error.statusCode || 500
	if (error.statusCode === 500) {
		console.log(error)
		return res.status(status).json({ message: 'something went wrong' })
	}
	res.status(status).json({ message: error.message })
})

module.exports = Router
