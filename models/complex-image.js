const { Sequelize, Model } = require('sequelize')

const sequelize = require('../utils/database')

class ComplexImage extends Model {}

ComplexImage.init(
	{
		complexImageId: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		complexId: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		imageUrl: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'complex_image',
	}
)

module.exports = ComplexImage
