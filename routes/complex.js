const express = require('express')

const complexController = require('../controllers/complex')
const validator = require('../middlewares/validation')
const isAuth = require('../middlewares/is-auth')

const Router = express.Router()

// / => GET
Router.get('/', validator.getComlexes, complexController.getComplexes)

// /complex => PUT
Router.put('/', isAuth, validator.putComplex, complexController.putComplex)

// /complex/:complexId => GET
Router.get('/:complexId', complexController.getComplex)

// /complex/:complexId => GET
Router.get('/schedule/:complexId', complexController.getComplexSchedule)

module.exports = Router
