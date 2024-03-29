const Sequelize = require('sequelize')

const sequelize = require('../utils/database')

const Comment = sequelize.define('comment', {
	commentId: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true,
	},
	content: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	score: {
		type: Sequelize.TINYINT,
		allowNull: false,
		defaultValue: 0,
	},
})

module.exports = Comment
