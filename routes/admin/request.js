const express = require('express')

const requestController = require('../../controllers/admin/request')
const {
	admin: { request: validator },
} = require('../../middlewares/validation')

const Router = express.Router()

// /admin/request/complex => GET
Router.get('/complex', validator.getComplexRequests, requestController.getComplexRequests)

// /admin/request/complex/:requestId => GET
Router.get('/complex/:requestId', validator.getComplexRequest, requestController.getComplexRequest)

// /admin/request/:requestId/complex/accept => DELETE
Router.delete(
	'/:requestId/complex/accept',
	validator.deleteAcceptRequest,
	requestController.deleteAcceptRequest
)

// /admin/request/:requestId/complex/reject => DELETE
Router.delete(
	'/:requestId/complex/reject',
	validator.deleteRejectRequest,
	requestController.deleteRejectRequest
)

module.exports = Router
