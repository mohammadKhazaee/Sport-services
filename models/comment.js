const { Sequelize, Model } = require('sequelize')

const sequelize = require('../utils/database')

class Comment extends Model {}

Comment.init(
	{
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
	},
	{
		sequelize,
		modelName: 'Comment',
	}
)
module.exports = Comment
