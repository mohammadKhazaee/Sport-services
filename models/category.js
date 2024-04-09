const { Sequelize, Model } = require('sequelize')
const { QueryTypes } = require('sequelize')

const sequelize = require('../utils/database')

class Category extends Model {
	static getChildren(categoryId) {
		return sequelize.query(`SELECT * FROM categories WHERE parentId =:categoryId`, {
			replacements: { categoryId },
			type: QueryTypes.SELECT,
		})
	}

	static getAllNodes() {
		return sequelize.query('SELECT * FROM categories', {
			type: QueryTypes.SELECT,
		})
	}

	static async getSubLeafs(categoryId) {
		const subCategoryIds = await sequelize.query(
			`
			WITH RECURSIVE subCategories AS
			(
				SELECT categoryId, parentId FROM categories WHERE parentId =:categoryId
				UNION ALL
				SELECT c.categoryId, c.parentId FROM subCategories AS cp JOIN categories AS c ON cp.categoryId = c.parentId
			)
			SELECT categoryId FROM subCategories
		`,
			{ replacements: { categoryId }, type: QueryTypes.SELECT }
		)
		const subCategoryIdsArray = subCategoryIds.map((c) => c.categoryId)
		return sequelize.query(
			`
				SELECT c1.* FROM categories c1
				LEFT JOIN categories c2 ON c2.parentId = c1.categoryId
				WHERE c2.categoryId IS NULL AND c1.categoryId ` +
				(subCategoryIds.length > 0 ? `in (:subCategoryIdsArray);` : '=:categoryId'),
			{ replacements: { subCategoryIdsArray, categoryId }, type: QueryTypes.SELECT }
		)
	}
}

Category.init(
	{
		categoryId: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		title_en: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		title_fa: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'category',
	}
)

module.exports = Category
