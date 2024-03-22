const express = require('express')

const mainController = require('../controllers/main')
const validator = require('../middlewares/validation')
const isAuth = require('../middlewares/is-auth')

const Router = express.Router()

// / => GET
Router.get('/', mainController.getIndex)

// // /teams => GET
// Router.get('/teams', validator.getTeams, mainController.getTeams)

// // /team/:teamId => GET
// Router.get('/team/:teamId', mainController.getTeam)

// // /team => POST
// Router.post('/team', isAuth, validator.postTeam, mainController.postTeam)

module.exports = Router
