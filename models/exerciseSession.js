const { Sequelize, Model } = require('sequelize')
const { QueryTypes, Op } = require('sequelize')

const sequelize = require('../utils/database')

class ExerciseSession extends Model {
	static async fetchComplexSchedules(complexId) {
		const currentDate = new Date()
		const schedules = await ExerciseSession.findAll({
			where: {
				complexId,
				week_offset: { [Op.in]: [0, 1, 2] },
			},
			attributes: { exclude: ['createdAt', 'updatedAt'] },
			// raw: true,
		})
		for (const s of schedules) {
			if ((s.status === 'booked' || s.status === 'closed') && s.endDate.getTime() <= currentDate) {
				s.status = 'open'
				s.userId = null
				s.endDate = null
				s.save()
			}
		}
		return schedules
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
		endDate: {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: null,
		},
		week_offset: {
			type: Sequelize.TINYINT,
			allowNull: false,
		},
		day_of_week: {
			type: Sequelize.TINYINT,
			allowNull: false,
		},
		time_of_day: {
			type: Sequelize.TIME,
			allowNull: false,
		},
		price: {
			type: Sequelize.DOUBLE,
			allowNull: false,
		},
		status: {
			type: Sequelize.ENUM(['booked', 'open', 'closed', 'booking']),
			allowNull: false,
			defaultValue: 'open',
		},
	},
	{
		sequelize,
		modelName: 'exercise_session',
	}
)

module.exports = ExerciseSession
