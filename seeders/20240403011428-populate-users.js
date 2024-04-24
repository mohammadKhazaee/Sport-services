'use strict'
const parseCsv = require('../utils/parse-csv')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// makes sure seeder only works in development and testing mode
		if (process.env.NODE_ENV === 'production') return

		const rawUsers = await parseCsv('user')
		await queryInterface.bulkInsert(
			'users',
			rawUsers.slice(1).map((u) => ({
				userId: u[0],
				phoneNumber: u[1],
				fName: u[2],
				lName: u[3],
				province: u[4],
				city: u[5],
				gender: u[6],
				password: u[7],
				email: u[8],
				createdAt: u[9],
				updatedAt: u[10],
			}))
		)
	},

	async down(queryInterface, Sequelize) {
		// makes sure seeder only works in development and testing mode
		if (process.env.NODE_ENV === 'production') return

		await queryInterface.bulkDelete('users', null, {})
	},
}
