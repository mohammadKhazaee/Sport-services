const express = require('express')

const complexController = require('../controllers/complex')
const validator = require('../middlewares/validation')
const isAuth = require('../middlewares/is-auth')

const Router = express.Router()

// /list-all => GET
Router.get('/list-all', validator.getListAll, complexController.getListAll)

// /complex => POST
Router.post('/', isAuth, validator.postComplex, complexController.postComplex)

// // /teams => GET
// Router.get('/teams', validator.getTeams, complexController.getTeams)

// // /team/:teamId => GET
// Router.get('/team/:teamId', complexController.getTeam)

module.exports = Router
