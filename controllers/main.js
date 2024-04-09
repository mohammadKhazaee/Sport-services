const { validationResult } = require('express-validator')

const User = require('../models/user')
const { getAllNodes } = require('../models/category')

exports.getIndex = async (req, res, next) => {
	try {
		const allCategories = await getAllNodes()
		res.status(200).json({ message: 'just nothing!', allCategories })
	} catch (err) {
		if (!err.statusCode) err.statusCode = 500
		next(err)
	}
}
