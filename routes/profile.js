const express = require('express')

const profileController = require('../controllers/profile')
const { profile: validator } = require('../middlewares/validation')

const Router = express.Router()

// GET /profile/complex
Router.get('/complex', validator.getComplexes, profileController.getComplexes)

module.exports = Router
