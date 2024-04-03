'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const categories = require('../data/categories')
		const now = new Date()
		await queryInterface.bulkInsert(
			'categories',
			categories.map((c) => ({ ...c, createdAt: new Date(), updatedAt: new Date() }))
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('categories', null, {})
	},
}
