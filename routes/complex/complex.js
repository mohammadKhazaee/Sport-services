const express = require('express')

const complexController = require('../../controllers/complex/complex')
const validator = require('../../middlewares/validation')
const isAuth = require('../../middlewares/is-auth')
const requestRouter = require('./request')

const Router = express.Router()

Router.use('/request', isAuth, requestRouter)

// / => GET
Router.get('/', validator.complex.getComlexes, complexController.getComplexes)

// /complex/:complexId => GET
Router.get('/:complexId', complexController.getComplex)

// /complex/:complexId => GET
Router.get('/schedule/:complexId', complexController.getComplexSchedule)

module.exports = Router
