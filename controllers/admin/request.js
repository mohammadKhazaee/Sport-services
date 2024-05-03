const ComplexRequest = require('../../models/complexRequest')

exports.getComplexRequests = async (req, res, next) => {
	const type = req.query.type

	const requests = await ComplexRequest.fetchRequests({ type })

	res.status(200).json({ message: 'success', requests })
}
