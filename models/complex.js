const { Sequelize, Model } = require('sequelize')
const { Op } = require('@sequelize/core')
const { QueryTypes } = require('sequelize')

const sequelize = require('../utils/database')
const Category = require('./category')
const Comment = require('./comment')
const cities = require('../data/cities.json')
const provinces = require('../data/provinces.json')
const User = require('./user')
const Facility = require('./facility')
const ExerciseSession = require('./exerciseSession')
const TimeHelper = require('../utils/timeHelper')

const COMPLEX_PER_PAGE = 15
const WEEKS_COVERED = 12

class Complex extends Model {
	static async getComplexes({
		verified,
		minPrice,
		maxPrice,
		onlineRes,
		facilities,
		city,
		size,
		categoryId,
		sortType,
		page = 1,
	} = {}) {
		const findQuery = {},
			orderQuery = sortType || ['createdAt', 'DESC']

		if (verified) findQuery.verified = verified
		if (onlineRes) findQuery.onlineRes = onlineRes
		if (city) findQuery.city = city
		if (size) findQuery.size = size
		if (minPrice)
			findQuery.price = {
				[Op.gte]: minPrice,
			}
		if (maxPrice)
			findQuery.price = {
				[Op.lte]: maxPrice,
			}
		if (facilities) {
			const facilityArray = facilities.split(',')
			const complexIds = await sequelize.query(
				`SELECT complexId FROM complex_facilities WHERE facilityId IN (:facilities) GROUP BY complexId HAVING COUNT(*) = :facCount`,
				{
					replacements: {
						facilities: facilityArray,
						facCount: facilityArray.length,
					},
					type: QueryTypes.SELECT,
				}
			)
			findQuery.complexId = {
				[Op.in]: complexIds.map((c) => c.complexId),
			}
		}
		if (categoryId) {
			const categoryArray = await Category.getSubLeafs(categoryId)
			const categoryIdArray = categoryArray.map((c) => c.categoryId)
			const complexIds = await sequelize.query(
				`SELECT complexId FROM complex_categories WHERE categoryId IN (:categoryIds)`,
				{
					replacements: {
						categoryIds: categoryIdArray,
					},
					type: QueryTypes.SELECT,
				}
			)
			findQuery.complexId = {
				[Op.in]: complexIds
					.map((cId) => cId.complexId)
					.filter((cId) => (findQuery.complexId ? findQuery.complexId[Op.in].includes(cId) : true)),
			}
		}

		return Complex.findAll({
			include: ['facilities'],
			where: findQuery,
			order: [orderQuery],
			offset: (page - 1) * COMPLEX_PER_PAGE,
			limit: COMPLEX_PER_PAGE,
		})
	}

	static fetchComplexById(complexId) {
		return Complex.findByPk(complexId, {
			include: ['facilities', Comment],
			attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
		})
	}

	static async countAll() {
		const tables = await sequelize.query('SHOW TABLE STATUS', { type: QueryTypes.SELECT })
		return tables.filter((t) => t.Name === 'complexes').map((t) => t.Rows)
	}
}

Complex.init(
	{
		complexId: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		size: {
			type: Sequelize.TINYINT,
			allowNull: true,
		},
		province: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		city: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		address: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		price: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: null,
		},
		openTime: {
			type: Sequelize.TIME,
			allowNull: true,
		},
		closeTime: {
			type: Sequelize.TIME,
			allowNull: true,
		},
		session_length: {
			type: Sequelize.ENUM(['60', '75', '90', '120']),
			allowNull: true,
		},
		description: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: null,
		},
		score: {
			type: Sequelize.TINYINT,
			allowNull: false,
			defaultValue: 0,
		},
		onlineRes: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		verified: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		sequelize,
		modelName: 'Complex',
	}
)

Complex.addHook('beforeValidate', (complex) => {
	const provinceId = cities.find((c) => c.name === complex.city).province_id
	const province = provinces.find((p) => p.id === provinceId)
	complex.province = province.name
})

Complex.addHook('afterSave', async (complex, options) => {
	try {
		const facilities = options.facilities
		const categories = options.categories

		const sessionsPerDay = TimeHelper.divide(
			complex.openTime,
			complex.closeTime,
			complex.session_length
		)
		if (sessionsPerDay === -1) {
			const error = new Error('time span is not divisible by session length')
			error.statusCode = 422
			throw error
		}

		let sessions = []
		for (let i = 0; i < WEEKS_COVERED; i++)
			for (let j = 0; j < 7; j++)
				for (let k = 0; k < sessionsPerDay; k++) {
					sessions.push({
						complexId: complex.complexId,
						price: complex.price,
						week_offset: i,
						day_of_week: j,
						time_of_day: TimeHelper.addMinutes(complex.openTime, complex.session_length * k),
					})
				}

		const sessionPromise = ExerciseSession.bulkCreate(sessions)
		const facilityPromise = Facility.findAll({
			where: { facilityId: { [Op.in]: facilities } },
		})
		const categoryPromise = Category.findAll({
			where: { categoryId: { [Op.in]: categories } },
		})

		const [facilityInstances, categoryInstances, sessionInstances] = await Promise.all([
			facilityPromise,
			categoryPromise,
			sessionPromise,
		])

		if (facilityInstances.length !== facilities.length) {
			const error = new Error('invalid facility ids')
			error.statusCode = 422
			throw error
		}
		if (categoryInstances.length !== categories.length) {
			const error = new Error('invalid category ids')
			error.statusCode = 422
			throw error
		}

		await Promise.all([
			complex.addFacilities(facilityInstances),
			complex.addCategories(categoryInstances),
			complex.addExercise_sessions(sessionInstances),
		])
	} catch (err) {
		complex.destroy()
		if (!err.statusCode) throw new Error('problem while saving associations complex')
		throw err
	}
})

module.exports = Complex