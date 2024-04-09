const { Sequelize, Model } = require('sequelize')
const { QueryTypes, Op } = require('sequelize')

const sequelize = require('../utils/database')

class ExerciseSession extends Model {
	static fetchComplexSchedules(complexId, startOfWeek, endOfWeek) {
		const transformedStart = startOfWeek.toISOString().slice(0, 19).replace('T', ' '),
			transformedEnd = endOfWeek.toISOString().slice(0, 19).replace('T', ' ')

		return ExerciseSession.findAll({
			where: {
				complexId,
				startDate: { [Op.between]: [transformedStart, transformedEnd] },
			},
			attributes: { exclude: ['createdAt', 'updatedAt'] },
		})
	}
}

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
