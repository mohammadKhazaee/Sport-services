const { Sequelize, Model } = require('sequelize')
const { Op } = require('@sequelize/core')
const { QueryTypes } = require('sequelize')

const sequelize = require('../utils/database')
const Category = require('./category')
const Comment = require('./comment')

const COMPLEX_PER_PAGE = 15

class Complex extends Model {
	static async getComplexes({
		minPrice,
		maxPrice,
		onlineRes,
		facilities,
		city,
		categoryId,
		sortType,
		page = 1,
	} = {}) {
		const findQuery = {},
			orderQuery = sortType || ['createdAt', 'DESC']

		if (onlineRes) findQuery.onlineRes = onlineRes
		if (city) findQuery.city = city
		if (minPrice)
			findQuery.minPrice = {
				[Op.gte]: minPrice,
			}
		if (maxPrice)
			findQuery.maxPrice = {
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
			attributes: { exclude: ['registration_num', 'createdAt', 'updatedAt', 'userId'] },
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
		registration_num: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		size: {
			type: Sequelize.STRING,
			allowNull: false,
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
		minPrice: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: null,
		},
		maxPrice: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: null,
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
	},
	{
		sequelize,
		modelName: 'Complex',
	}
)

module.exports = Complex
