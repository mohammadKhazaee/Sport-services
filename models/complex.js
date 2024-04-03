const { Sequelize, Model } = require('sequelize')
const { Op } = require('@sequelize/core')
const { QueryTypes } = require('sequelize')

const sequelize = require('../utils/database')
const Category = require('./category')

class Complex extends Model {
	static async getComplexes({
		minPrice,
		maxPrice,
		onlineRes,
		facilities,
		city,
		categoryId,
		sortType,
	} = {}) {
		const findQuery = {}

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
			console.log(findQuery.complexId)
			findQuery.complexId = {
				[Op.in]: complexIds
					.map((cId) => cId.complexId)
					.filter((cId) => (findQuery.complexId ? findQuery.complexId[Op.in].includes(cId) : true)),
			}
			console.log(findQuery.complexId[Op.in])
		}

		return Complex.findAll({
			include: ['facilities'],
			where: findQuery,
			order: [sortType],
			// limit: 100,
		})
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
