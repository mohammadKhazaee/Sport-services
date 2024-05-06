const express = require('express')

const requestRouter = require('./request')

const Router = express.Router()

Router.use('/request', requestRouter)

// future admin related routes will be down here

module.exports = Router
