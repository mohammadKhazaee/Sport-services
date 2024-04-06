const { Sequelize, Model } = require('sequelize')
const { QueryTypes } = require('sequelize')

const sequelize = require('../utils/database')

class ExerciseSession extends Model {}

ExerciseSession.init(
	{
		exerciseSessionId: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		complexId: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		userId: {
			type: Sequelize.UUID,
			defaultValue: null,
			allowNull: true,
		},
		startDate: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		price: {
			type: Sequelize.DOUBLE,
			allowNull: false,
		},
		status: {
			type: Sequelize.ENUM(['booked', 'open', 'closed', 'booking']),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'exercise_session',
	}
)

module.exports = ExerciseSession
