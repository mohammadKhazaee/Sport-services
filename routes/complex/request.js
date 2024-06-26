const express = require('express')

const requestController = require('../../controllers/complex/request')
const {
	complex: { request: validator },
} = require('../../middlewares/validation')

const Router = express.Router()

// /complex/request => GET
Router.get('/', validator.getRequests, requestController.getRequests)

// /complex/request/:requestId => GET
Router.get('/:requestId', validator.getRequest, requestController.getRequest)

// /complex/request/create => POST
Router.post('/create', validator.postCreateRequest, requestController.postCreateRequest)

// /complex/request/:complexId/remove => POST
Router.post('/:complexId/remove', validator.postRemoveRequest, requestController.postRemoveRequest)

// /complex/request/:complexId/update => POST
Router.post('/:complexId/update', validator.postUpdateRequest, requestController.postUpdateRequest)

module.exports = Router
