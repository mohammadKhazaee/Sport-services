'use strict'
require('dotenv').config()

const parseCsv = require('../utils/parse-csv')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// makes sure seeder only works in development and testing mode
		if (process.env.NODE_ENV === 'production') return

		const rawComplexes = await parseCsv('complex')
		await queryInterface.bulkInsert(
			'complexes',
			rawComplexes.slice(1).map((u) => ({
				complexId: u[0],
				registration_num: u[1],
				name: u[2],
				size: u[3],
				province: u[4],
				city: u[5],
				address: u[6],
				minPrice: u[7],
				maxPrice: u[8],
				description: u[9],
				score: u[10],
				onlineRes: u[11],
				userId: u[12],
				createdAt: u[13],
				updatedAt: u[14],
			}))
		)
	},

	async down(queryInterface, Sequelize) {
		// makes sure seeder only works in development and testing mode
		if (process.env.NODE_ENV === 'production') return

		await queryInterface.bulkDelete('complexes', null, {})
	},
}
