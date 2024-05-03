const express = require('express')

const requestController = require('../../controllers/admin/request')
const {
	admin: { request: validator },
} = require('../../middlewares/validation')

const Router = express.Router()

// /admin/request/complex => GET
Router.get('/complex', validator.getComplexRequests, requestController.getComplexRequests)

// /admin/request/:requestId/complex/accept => PATCH
// Router.patch(
// 	'/:requestId/complex/accept',
// 	validator.patchAcceptRequest,
// 	requestController.patchAcceptRequest
// )

// /admin/request/:requestId/complex/reject => DELETE
// Router.delete(
// 	'/:requestId/complex/reject',
// 	validator.deleteRejectRequest,
// 	requestController.deleteRejectRequest
// )

module.exports = Router
